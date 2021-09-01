import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import BalanceCard from "../component/BalanceCard";
import TransactionList from "../component/TransactionList";
import Header from "../component/Header";

const Balance = () => {
    // Card.js에서 fintechUseNo을 get 방식으로 보냈음으로 queryString 사용
    const { search } = useLocation();
    const { fintechUseNo } = queryString.parse(search);
    // 잔액 정보를 저장할 balance
    const [balance, setBalance] = useState({});
    // 거래 내역 정보를 저장할 transaction
    const [transaction, setTransaction] = useState([]);
    console.log(fintechUseNo);
  
    // bank_trans_id의 경우 이용기관번호 + U + 무작위 자릿수 9자리
    // 중복해서 사용할 수 없기 때문에 API를 사용할 때마다 갱신해줌 
    const genTransId = () => {
        let countnum = Math.floor(Math.random() * 1000000000) + 1;
        let transId = "찾아서 입력" + countnum; //이용기관번호 본인것 입력
        return transId;
    };

    // Balance.js 실행되자 마자 아래 두 함수 실행
    useEffect(() => {
        getBalanceData();
        getTransactionList();
    }, []);

    // 잔액 조회를 위한 함수
    const getBalanceData = () => {
        const accessToken = localStorage.getItem("accessToken");
        const option = {
          method: "GET",
          url: `/v2.0/account/balance/fin_num`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            bank_tran_id: genTransId(),
            fintech_use_num: fintechUseNo,
            tran_dtime: "20210826132500",
          },
        };
        axios(option).then(({ data }) => {
          console.log(data);
          setBalance(data);
        });
      };
      
    // 거래내역 조회를 위한 함수
    const getTransactionList = () => {
        const accessToken = localStorage.getItem("accessToken");
        const option = {
          method: "GET",
          url: `/v2.0/account/transaction_list/fin_num`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            bank_tran_id: genTransId(),
            fintech_use_num: fintechUseNo,
            inquiry_type: "A",
            inquiry_base: "D",
            from_date: "20210101",
            to_date: "20210101",
            sort_order: "D",
            tran_dtime: "20210826132500",
          },
        };
        axios(option).then(({ data }) => {
          console.log(data);
          setTransaction(data.res_list);
        });
    };

    return (
        <div>
            <Header title="잔액조회"></Header>
            <BalanceCard
                bankName={balance.bank_name}
                fintechNo={balance.fintech_use_num}
                balance={balance.balance_amt}
            ></BalanceCard>
            <TransactionList transactionList={transaction}></TransactionList>
        </div>
    )
}

export default Balance
