import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const ModalCardBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  padding: 20px;
  border: 1px #112211 solid;
`;
const CardTitle = styled.div`
  font-size: 1rem;
  color: black;
`;
const FintechUseNo = styled.div`
  font-size: 0.7rem;
  margin-bottom: 30px;
`;

const WithDrawButton = styled.button`
  border: none;
  padding: 0.3rem;
  background: #2aa450;
  color: white;
  margin-top: 0.3rem;
`;

const ModalCard = ({ bankName, fintechUseNo, tofintechno }) => {
  // input data 받아온다음에 결제 버튼을 눌렀을때 axios 출금 이체를 바생시키기;
  const [amount, setamount] = useState("");
  const handleAmountChange = (e) => {
    const { value } = e.target;
    setamount(value);
  };
  const genTransId = () => {
    let countnum = Math.floor(Math.random() * 1000000000) + 1;
    let transId = "찾아서 입력" + countnum; //이용기관 번호 본인것 입력
    return transId;
  };

  const handleWithdraw = () => {
    //사용자 출금 요청 발생
    var sendData = JSON.stringify({
        bank_tran_id: genTransId(),
        cntr_account_type: "N",
        // 금융위 API 개발자 사이트에서 찾을 수 있는 약정계좌중 출금계좌
        cntr_account_num: "찾아서 입력",
        dps_print_content: "이용료",
        fintech_use_num: fintechUseNo,
        wd_print_content: "이용료",
        tran_amt: amount,
        tran_dtime: "20210528114700",
        req_client_name: "홍길동",
        req_client_fintech_use_num: fintechUseNo,
        req_client_num: "HONGGILDONG1234",
        transfer_purpose: "ST",
        recv_client_name: "홍길동",
        recv_client_bank_code: "097",
        // 금융위 API 개발자 사이트에서 찾을 수 있는 약정계좌중 출금계좌
        recv_client_account_num: "찾아서 입력",
    });
    const option = {
      method: "POST",
      url: "/v2.0/transfer/withdraw/fin_num",
      headers: {
        Authorization: `bearer ${localStorage.getItem("accessToken")}`,
      },
      data: sendData,
    };
    axios(option).then(({ data }) => {
      console.log(data);
      if (data.rsp_code === "A0000") {
        //입금 이체 발생시키기
        deposit();
      }
    });
  };

  const deposit = () => {
    const twoLeggedToken =
    //처음 발급받은 토큰이 아닌 금융위 API 설명서를 참고하여 twoLegged Token을 발급 받아야함
      "찾아서 입력";
    const option = {
      method: "POST",
      url: "/v2.0/transfer/deposit/fin_num",
      headers: {
        Authorization: `bearer ${twoLeggedToken}`,
      },
      data: {
        cntr_account_type: "N",
        // 금융위 개발자 사이트 mypage에서 확인할 수 있는 약정계좌중 입금계좌
        cntr_account_num: "찾아서 입력",
        wd_pass_phrase: "NONE",
        wd_print_content: "환불금액",
        name_check_option: "off",
        tran_dtime: "20200721151500",
        req_cnt: "1",
        req_list: [
          {
            tran_no: "1",
            bank_tran_id: genTransId(),
            fintech_use_num: tofintechno,
            print_content: "쇼핑몰환불",
            tran_amt: amount,
            req_client_name: "홍길동",
            req_client_fintech_use_num: tofintechno,
            req_client_num: "110435475398",
            transfer_purpose: "ST",
          },
        ],
      },
    };
    axios(option).then(({ data }) => {
      if (data.rsp_code === "A0000") {
        alert("결제 완료");
      }
    });
  };

  return (
    <ModalCardBlock>
      <CardTitle>{bankName}</CardTitle>
      <FintechUseNo>{fintechUseNo}</FintechUseNo>
      <p>{tofintechno}에 출금이체를 발생시킵니다.</p>
      <input onChange={handleAmountChange}></input>
      <WithDrawButton onClick={handleWithdraw}>결제하기</WithDrawButton>
    </ModalCardBlock>
  );
};

export default ModalCard;
