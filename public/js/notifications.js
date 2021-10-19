/**
 * Variável global para guardar o estado da aplicação
 */
const AppState = {
    SSE: null,
    channel: null,
    user: null
}

function Init() {
    /** 
     * Adiciona o event istener de click nos botoes de subscribe 
     * */
    const actBtns = document.querySelectorAll("button[data-action-subscribe-channel]");
    actBtns.forEach(elm => elm.addEventListener('click', () => subscribeChannel()))
}

/**
 * Gerencia a exibição de componentes na subscrição de canal
 */
function subscribeChannel() {
    /**
     * Obtem os elementos da interface por ids
     */
    const subscribeBox = document.getElementById('subscribe-box');
    const subscribeControl = document.getElementById('subscribe-control');
    const notificationContainer = document.getElementById('notification');

    /**
     * Chama a função para fazer a chamada no endpoint do SSE
     */
    subscribeEventSource(subscribeControl.value);

    /**
     * Atribui as classes css que exibem.esconde os lementos de subscrição da tela
     */
    subscribeBox.classList.add('is-hidden');
    notificationContainer.classList.remove('is-hidden');
}

/**
 * Cria um novo elemento de mensagem e atribui o conteudo recebido a este elemento
 * @param {Notification} notification 
 * @returns {HtmlElement}
 */
function renderMesssage(notification) {
    /**
     * Se não houver mensagem ele aborta todo o processo
     */
    if(!notification.message){
        return
    }

    /**
     * Cria o componentede card da mensagem
     */
    const messageCard = document.createElement('div');
    messageCard.setAttribute('class', 'card')

    /**
     * Cria o parágrafo e atribui a data a este elemento e insere ele no card da mensagem
     */
    const messageDate = document.createElement('p');
    messageDate.setAttribute('class', 'message-date')
    messageDate.innerText = notification.date;
    messageCard.appendChild(messageDate);

    /**
     * Cria um parágrafo e atribui o contúdo da mensagem a este elemento e insere no card da mensagem
     */
    const messageParagraph = document.createElement('p');
    messageParagraph.innerText = notification.message;
    messageCard.appendChild(messageParagraph)

    /**
     * Insere o componente de card no container das mensagens na tela
     */
    const notificationContainer = document.getElementById('notification')
    notificationContainer.appendChild(messageCard)
}

/**
 * Realiza a chamada de subscrição ao endpoint SSE
 * @param {string} channel 
 */
function subscribeEventSource(channel = ''){
    /**
     * Faz a conexão com o endpoint SSE e guarda na prop correpondente do estado
     */
    AppState.SSE = new EventSource(`http://localhost:3000/users/notifications/${channel}`)

    /**
     * Atribui função para tratar o recebimento de mensagens do endpoint SSE
     * @param {Event} event 
     */
    AppState.SSE.onmessage = function(event) {
        const notification = JSON.parse(event.data);
        renderMesssage(notification);
    }
}

/**
 * Chama a funcão de inicialização
 */
Init();
