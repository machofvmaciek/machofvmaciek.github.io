const form = document.getElementById('form');

const nickname = document.getElementById('nickname');
const receiver_num = document.getElementById('receiver_num');
const message = document.getElementById('message');
const terms = document.getElementById('terms');


form.addEventListener('submit', (e) =>{
    e.preventDefault();
    //console.log(terms.checked);
    checkInputs();
});

function checkInputs(){
            // przepisanie wartosci, trim() - obciecie spacji na poczatku i koncu stringu
    //const nicknameValue = nickname.value.trim();
    let nicknameValue = nickname.value.trim();
    //const receiverNumValue = receiver_num.value.trim();
    let receiverNumValue = receiver_num.value.trim();
    const messageValue = message.value.trim();


    //console.log(nicknameValue, receiverNumValue, messageValue);
            // walidacja nickaname'u
    if(nicknameValue === ''){
        setErrorFor(nickname, 'Nickname cannot be blank');
    }
    else{
        setSuccessFor(nickname);
        nicknameValue.replace(/\s/g, "");   // usuniecie spacji w srodku stringu
        //console.log(nicknameValue);
    }

            // walidacja numeru tel. odbiorcy
    if(receiverNumValue === ''){
        setErrorFor(receiver_num, 'Telephone number is necessary');
    }
    else if(receiverNumValue.length <9){
        setErrorFor(receiver_num, "It's too short!");
    }
    else if(receiverNumValue.length > 18){
        setErrorFor(receiver_num, "It's too long!");
    }
    else{
            // nie trzeba usuwac spacji - html input type number na to nie pozwala
        setSuccessFor(receiver_num);
        receiverNumValue = '48' + receiverNumValue;
        console.log(receiverNumValue);
    }

            // walidacja wiadomosci tekstowej
    if(messageValue === ''){
        setErrorFor(message, 'You shall set a message');
    }
    else if(messageValue.length > 160){
            // maksymalna dl. sms-a bez polskich znakow to 160, mozna zmienic zeby w przyszlosci dzielilo na wiecej smsow
        setErrorFor(message, 'Your message is too long. Make it under 160 signs!');
    }
    else{
        setSuccessFor(message);
    }

            // walidacja terms of use
    if(terms.checked == false){
        setErrorFor(terms, 'Please accept Terms of Use');
    }
    else{
        setSuccessFor(terms);
    }

            // ustalenie czy cala walidacja przeszla pomyslnie  
    const strClassSuccess = "form-control success";     // klasa success dodana do elementu - string jako template do porownywania
    const inputsClass = [nickname.parentElement.className, receiver_num.parentElement.className, message.parentElement.className, terms.parentElement.className];   // array klas wszystkich elementow(parentow inputow - form-control)

            // funkcja zwracajaca true, jesli wszytskie elementy klasy form-control zawieraja klase success
    const result = inputsClass.every(value => {
        //console.log(inputsClass);
        return value === strClassSuccess;
    });

    console.log("Wszytskie success: " + result);
            // funkcja tworzaca JSONa jesli wszytskie form-control maja success
    if(result){
        //const fullMessageJSON = JSON.stringify([nicknameValue, receiverNumValue, messageValue]);    // gotowy JSON do wyslania na serwer
        const fullMessageJSON = JSON.stringify({nickname: nicknameValue, receiverNum: receiverNumValue, message: messageValue}, null, '\t');    // gotowy JSON do wyslania na serwer
        console.log(fullMessageJSON);

        // do wyswietlenia(jakby ktos zapomnial o istnieniu konsoli)
        const JSONresultDiv = document.getElementById('JSON-result')
        JSONresultDiv.innerText = "JSON: " + fullMessageJSON;

            // przeslanie jsona na serwer motoda POST
          
        //$.post("receive.php",{json_mes: fullMessageJSON});
        //form.submit(); //->DZIALA
        /*
        var request = new XMLHttpRequest();
        request.open('POST', '/sms_sender/receive.php', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(fullMessageJSON);
        */

        $.post("receive.php", {json_mes: fullMessageJSON}).done(function(data){
            console.log("post sended id: " + fullMessageJSON);
        });
    }
}

function setErrorFor(inputId, message){
        // funckja przyjmujaca ID elementu do zmiany
            // ustawienie erroru - zapisanie tekstu do DOM small, ustawienie klasy z errorem
    const formControl = inputId.parentElement;

    const small = formControl.querySelector('small');
    small.innerText = message;

    formControl.className = 'form-control error';   // dolozenie klasy error

}

function setSuccessFor(inputId){
        // funckja przyjmujaca ID elementu do zmiany
            // ustwaienie klasy z sukcesem
    const formControl = inputId.parentElement;
    
    formControl.className = 'form-control success'; // dolozenie klasy success
}


// TO DO:
/*
    - dodac selektor numerow kierunkowych
    - lepsza walidacja numer tel - usunac mozliwosc ujemnej wartosci
    - hiperlacze do "terms of use"
    - dodac recaptcha - jak to zrobic skoro potrzebne zapytanie serwerowe w celu weryfikacji recaptchy?
    - ikony error/success
    - full wizualka
    - jesli bedzie do przeslania zdjecie: zdjecie nalezy przekonwertowac do base64 string zeby moc wrzucic je do JSON, nastepnie po odebraniu JSONa przekonwertowac z powrotem na obraz
    - dolozyc dzielenie na 2 i wiecej smsy w przypadku zbyt dluegiej wiadomosci(opcjonalnie)

    TRUDNE TO DO:
    - przeslac wartosci po walidacji i obrobce od klienta do serwera
*/