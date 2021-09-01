import React, { useState, useEffect } from "react";
import Header from "../component/Header";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

//AddUser에서 인증이 완료 후 인증 코드, AccessToken 등 유저 정보를 가져옴
const AuthResult = () => {
    // authResult로 리다이렉트 된 후 useLocation과 quertString으로
    // 인증 코드 부분을 파싱해옴. 
    const { search } = useLocation();
    const { code } = queryString.parse(search);
    
    const [accessToken, setAccessToken] = useState("토큰 받아오기 전");
    const [userSeqNo, setUserSeqNo] = useState("user seq no");
    
    // useEffect란 component의 생성, 업데이트, 언마운트 과정에서 원하는 시점에
    // component 실행을 control할 수 있다.
    useEffect(() => {
        getAccessToken();
    }, []) // []를 넣어두면 시작과 동시에 component를 실행한다.

    const getAccessToken = () => {
        // 금융위 API 설명서의 사용자 토큰 발급 부분 확인하기
        const sendData = {
            code: code,
            client_id: "찾아서 입력",
            client_secret: "찾아서 입력",
            redirect_uri: "http://localhost:3000/authResult",
            grant_type: "authorization_code",
         };
         const encodedSendData = queryString.stringify(sendData);
         // stringify를 이용하여 전달하는 sendData 형식을 Json 형식으로 변경
     
         const option = {
           method: "POST",
           url: "/oauth/2.0/token",
           headers: {
             "Content-Type": "application/x-www-form-urlencoded",
           },
           data: encodedSendData,
         };
     
         axios(option).then((response) => {
           console.log(response.data.access_token);
           setAccessToken(response.data.access_token);
           setUserSeqNo(response.data.user_seq_no);
           // 로컬 스토리지에 데이터 저장
           localStorage.setItem("accessToken", response.data.access_token);
           localStorage.setItem("userSeqNo", response.data.user_seq_no);
           // 토큰을 얻은 후 /main 페이지로 다시 보냄.
           window.opener.location.href = "/main";
           window.close();
         });
         //axios 오브젝트 설정
       };
       // main으로 보내는 걸 주석처리하면 아래 내용을 확인할 수 있음.
       return (
         <div>
           <Header title="인증 결과"></Header>
           <p>인증 코드 : {code}</p>
           <p>AccessToken : {accessToken}</p>
           <p>userSeqNo : {userSeqNo}</p>
         </div>
       );
     };
     
export default AuthResult