"use strict";

/* ****************************************
  要素一覧
**************************************** */

const formElement = document.getElementById("form");
const zipcodeElement = document.getElementById("zipcode");
const zipcodeErrorElement = document.getElementById("zipcodeError");
const addressElement = document.getElementById("address");
const copyElement = document.getElementById("copy");

/* ****************************************
  処理
**************************************** */

formElement.addEventListener("submit", onSubmit);
copyElement.addEventListener("click", copyToClipboard);

/* ****************************************
  関数一覧
**************************************** */

/** 郵便番号を検証する */
function validateZipcode(zipcode) {
  // 郵便番号の正規表現
  const pattern = /^\d{3}-?\d{4}$/;
  // 入力された郵便番号が正しいかどうかを返す
  return pattern.test(zipcode);
}

/** 郵便番号のエラーメッセージを設定する */
function setZipcodeError(isValid) {
  // エラーメッセージを設定する
  if (isValid) {
    zipcodeErrorElement.innerText = "";
  } else {
    zipcodeErrorElement.innerText = "郵便番号が正しくありません";
  }
}

/* ****************************************
  イベントの関数一覧
**************************************** */

async function onSubmit(event) {
  // イベントをキャンセルする
  event.preventDefault();

  // 郵便番号を取得する
  const zipcode = zipcodeElement.value;
  //　郵便番号が正しくない場合は、エラーメッセージを表示する
  const isValid = validateZipcode(zipcode);
  // 郵便番号が正しくない場合は、エラーメッセージを表示する
  setZipcodeError(isValid);

  if (!isValid) {
    return;
  }

  // 郵便番号を住所に変換するWebAPIのURL
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;
  try {
    // WebAPIにリクエストを送信する
    const response = await fetch(url);
    // レスポンスデータをJSON形式からオブジェクトに変換する
    const data = await response.json();
    // 住所を表示する
    const result = data.results[0];
    addressElement.innerText = `${result.address1}${result.address2}${result.address3}`;
  } catch (error) {
    // 郵便番号から住所を取得できなかったメッセージを表示する
    addressElement.innerText = "住所が取得できませんでした";
  }
}

/** クリップボードにコピーする */
function copyToClipboard() {
  // 住所を取得する
  const address = addressElement.innerText;

  // 住所が空の場合は何もしない
  if (address.length === 0) {
    return;
  }

  // 住所をクリップボードにコピーする
  try {
    navigator.clipboard.writeText(address);
    alert("住所をコピーしました");
  } catch (error) {
    alert("コピーに失敗しました");
  }
}
