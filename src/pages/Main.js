import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../component/Header";
import Card from "./Card";

const Main = () => {
    const [accountList, setAccountList] = useState([]);
    
    useEffect(() => {
        getAccountList();
    }, []);

    const getAccountList = () => {
        // AuthResult에서 로컬스토리지에 저장한 accessToken과 userSeqNo를 받아옴
        const accessToken = localStorage.getItem("accessToken");
        const userSeqNo = localStorage.getItem("userSeqNo");
        // 금융위 API 설명서의 계좌 정보 부분 참고 (사용자 계좌 목록 요청)
        const option = {
          method: "GET",
          url: `/v2.0/user/me`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user_seq_no: userSeqNo,
          },
        };
        axios(option).then(({ data }) => {
          console.log(data);
          setAccountList(data.res_list);
        });
      };

    return (
        <div>
            <Header title={"메인"}></Header>
            {accountList.map((account) => {
                return (
                    <Card
                        key={account.fintech_use_num} //warning을 없애기 위함
                        bankName={account.bank_name}
                        fintechUseNo={account.fintech_use_num}
                    ></Card>
                );
            })}
        </div>
  );
};

export default Main
