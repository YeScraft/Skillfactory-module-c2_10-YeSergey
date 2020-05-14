// выделяем объекты
cat = document.querySelector('.cat');
dog = document.querySelector('.dog');
parrot = document.querySelector('.parrot');
vote = document.querySelector('.vote');
result = document.querySelector('.result');

let response = null;

// методом всплытия события определяем какая кнопка была нажата и вызываем соответствующий "пустой" POST запрос
// с помощью fetch()
vote.onclick = async function do_vote(e){
    if (e.target == cat) {
            response = await fetch('https://sf-pyw.mosyag.in/sse/vote/cats', {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'}
        });
    }
    else if (e.target == dog) {
        response = await fetch('https://sf-pyw.mosyag.in/sse/vote/dogs ', {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'}
        });
    }
    else if (e.target == parrot) {
        response = await fetch('https://sf-pyw.mosyag.in/sse/vote/parrots', {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'}
        });
    }
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        console.log(response.status);
        // скрываем панель голосования и отображаем панель результата голосования
        vote.hidden = true;
        result.hidden = false;
        vote_result();
        } else {
        alert("Ошибка HTTP: " + response.status);
        }
  }

function vote_result(){
    // выделяем соответствующие прогресс бары
    vote_cat = document.querySelector('.vote_cat');
    vote_dog = document.querySelector('.vote_dog');
    vote_parrot = document.querySelector('.vote_parrot');
    // задаем соединение с сервером для получения данных, как в модуле
    const header = new Headers({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
    })
    
    const ES = new EventSource('https://sf-pyw.mosyag.in/sse/vote/stats', header);
    
    // ES.onopen = event => {
    //   console.log(event)
    // }
    
    ES.onerror = error => {
      ES.readyState ? console.error("⛔ EventSource failed: ", error) : null;
    };
    // определяем процент голосов за каждого из кандидатов
    ES.onmessage = message => {
        // преобразуем полученную строку от сервера в json объект
        let result = JSON.parse(message.data)
        vote_cat.style = "width:"+((result['cats']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)+"%"
        vote_cat.textContent = `${((result['cats']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)}%`
        vote_dog.style = "width:"+((result['dogs']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)+"%"
        vote_dog.textContent = `${((result['dogs']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)}%`
        vote_parrot.style = "width:"+((result['parrots']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)+"%"
        vote_parrot.textContent = `${((result['parrots']*100)/(result['cats']+result['dogs']+result['parrots'])).toFixed(2)}%`
    }
}
