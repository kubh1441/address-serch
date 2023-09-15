
const sendRequestButton = document.getElementById("sendRequestButton");
const resetButton = document.getElementById("resetButton");
const postcodeInput = document.getElementById("postcodeInput");
const resultContainer = document.getElementById("resultContainer");

sendRequestButton.addEventListener("click", sendRequest);
resetButton.addEventListener("click", resetAll);

async function sendRequest(){
    const postCode = postcodeInput.value;

    if(!isValidPostCode(postCode)){
        resultContainer.innerHTML = `<p>バリデーションエラー : 無効な郵便番号です。</p>`;
        return;
    }

    resultContainer.innerHTML = "<p>リクエストを送信中。。。</p>";

    try{
        const data = await getResponse(postCode);
        handleResponse(data);
    }catch(error){
        handleRequestError(error);
    }
};

async function getResponse(postCode){
    try{
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postCode}`);
        const data = await response.json();//レスポンスを解析してjsonに変換するのも非同期処理の一種だったりする。

        //ステータスコードが200以外のエラーを投げる
        if(data.status !== 200){
            throw new Error(`${data.message}`);
        }

        return data;
    }catch(error){
        throw error;
    }
}

function isValidPostCode(postCode){
    //バリデーションルール
    return /^[0-9]{7}$/.test(postCode);

}

function handleResponse(responseDataObj) {
    if(responseDataObj.results != null){
        let addressData = responseDataObj.results[0];
        let resultsText = "";

        for(let key in addressData) {
            resultsText += `<p>${key} : ${addressData[key]}</p>`;
        }

        resultContainer.innerHTML = resultsText;
    }else{
        resultContainer.innerHTML = `<p>該当する郵便番号と住所情報は見つかりませんでした。</p>`;
    }
}

function handleRequestError(error){
    resultContainer.innerHTML = `<p>エラーが発生しました。</p><p>メッセージ : ${error.message}</p>`;
}

function resetAll() {
    postcodeInput.value = "";
    resultContainer.innerHTML = '<p>リクエストを送信するにはボタンを押してください。</p>';
}