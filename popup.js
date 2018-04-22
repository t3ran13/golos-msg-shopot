function Page() {
    var api = null;
    var rewardPerUser = null;
    var UsersAskedReward = null;
    var msgListByAuthors = {};
}

var Page = new Page();

Page.setApi = function(platform) {
    console.log('setApi');

    if (platform === 'golos') {
        api = golos;
        api.config.set('websocket','wss://ws17.golos.blog');
    } else {
        api = steem;
        steem.api.setOptions({ url: 'https://api.steemit.com' });
    }
}

Page.getApi = function() {
    console.log('getApi');

    return api;
}

Page.getMsgListByAuthors = function() {
    console.log('msgListByAuthors');

    return msgListByAuthors;
}

Page.setMsgListByAuthors = function(list) {
    console.log('msgListByAuthors');

    msgListByAuthors = list;
}

Page.insertHTMLById = function(id, html) {
    console.log('insertHTMLById', id);


    var msgWindow = document.getElementById(id);
    msgWindow.innerHTML = html;
}

Page.setTextValue = function(id, value) {
    console.log('setTextValue', id);


    document.getElementById(id).value = value;
}

// Page.setUsersAskedReward = function(list) {
//     console.log('setUsersAskedReward');
//
//     UsersAskedReward = list;
// }
//
// Page.getUsersAskedReward = function() {
//     console.log('getUsersAskedReward');
//
//     return UsersAskedReward;
// }

Page.changePlatform = function() {
    console.log('changePlatform');

    // var platform = document.querySelector('input[name="platform"]:checked').value;
    var platform = 'golos';
    Page.setApi(platform);
    console.log('platform', platform);

    // Page.displaySelectCurrency(platform);
}

Page.showPayerBalance = function() {
    console.log('showPayerBalance');

    var user = document.getElementById('msg-from').value;
    var field = document.getElementById('payer-balance');
    field.innerHTML = '~';

    Page.getApi().api.getAccounts([user], function(err, result) {
        console.log('showPayerBalance',user);
        console.log(err, result);
        if (err != null)
        {
            console.log('err', err);
            Page.insertHTMLById('error-info', err.message);
            return ;
        }

        field.innerHTML = result[0].balance + ' and ' + result[0].sbd_balance;
    });
}

Page.getAccountMsgHistory = function() {
    console.log('getAccountMsgHistory');
    var limit = 1000;

    if (Page.validateIsNotEmpty(['msg-from', 'memo-private-key'])) {
        var user = document.getElementById('msg-from').value;
        var interval = document.querySelector('input[name="history-interval"]:checked').value;
        var until_date = new Date();
        until_date.setHours(until_date.getHours() - parseInt(interval, 10));

        Page.insertHTMLById('msg-window-users-list', '~');
        Page.insertHTMLById('msg-window-chat', '');

        Page.getApi().api.getAccountHistory(user, -1, 0, function(err, result) {
            console.log('getAccountHistory',user);
            console.log(err, result);
            if (err != null)
            {
                console.log('err', err);
                Page.insertHTMLById('error-info', err.message);
                return ;
            }

            var total = result[0][0];
            limit = limit > total ? total : limit;

            console.log('total', total);
            console.log('listStart', Page.getMsgListByAuthors());
            Page.getAccountMsgHistoryByPart(user, total, limit, Page.getMsgListByAuthors(), until_date);
        });
    }
}

Page.getAccountMsgHistoryByPart = function (user, from, limit, list, until_date) {
    console.log('getAccountAllHistory', user, from, limit, list, until_date);
    return Page.getApi().api.getAccountHistory(user, from, limit, function(err, result) {
        console.log(err, result);
        if (err != null)
        {
            console.log('err', err);
            Page.insertHTMLById('error-info', err.message);
            return ;
        }

        var isStop = false;
        result.reverse();
        // console.log('result', result);
        for (var j = 0; j < result.length; j++) {
            if (
                result[j][1]['op'][0] === 'transfer'
                && new Date(result[j][1]['timestamp']) >= until_date
                && result[j][1]['op'][1]['memo'].substring(0,1) === '#'
            ) {
                var msgUser = null;
                if (result[j][1]['op'][1]['from'] !== user) {
                    msgUser = result[j][1]['op'][1]['from'];
                } else {
                    msgUser = result[j][1]['op'][1]['to'];
                }
                if(typeof list[msgUser] === 'undefined'){
                    list[msgUser] = {};
                    // console.log('clear user', msgUser);
                }
                // console.log('j', j);
                // console.log('trx_id', result[j][1]['trx_id']);
                list[msgUser][result[j][1]['trx_id']] = result[j][1];
            } else if (new Date(result[j][1]['timestamp']) < until_date) {
                isStop = true;
            }
        }

        from = from - limit;
        limit = limit > from ? from : limit;

        if (!isStop && from > 0) {
            Page.insertHTMLById('msg-window-users-list', 'found conversations '  + Object.keys(list).length + ' ~');
            Page.getAccountMsgHistoryByPart(user, from - limit, limit, list, until_date);
        } else {
            var users = Object.keys(list);
            Page.insertHTMLById('msg-window-users-list', 'found conversations '  + users.length + ' ~');
            console.log('listEnd', list);
            // Page.initChatWindow();
            if (users.length) {
                Page.showChatsWithUsers();
                Page.showChatOfUser(users[0]);
            }

            //save to storage
            // var data = {'msgListByAuthors': Page.getMsgListByAuthors()};
            // Page.storageSave(data);
        }
    });
}

Page.initChatWindow = function() {
    console.log('initChatWindow');

    html = '<table height="100px" width="200px">' +
                '<tr>' +
                    '<td id="msg-window-users-list" valign="top"></td>' +
                    '<td id="msg-window-chat" valign="bottom"></td>' +
                '</tr>' +
        '</table>';

    Page.insertHTMLById('msg-window', html);
}

Page.showChatOfUser = function(user) {
    console.log('showChatOfUser');

    var list = Page.getMsgListByAuthors();
    var owner = document.getElementById('msg-from').value;
    var chat = '';
    var keys = Object.keys(list[user]);
    keys.reverse();
    console.log('showChatOfUser', keys);
    console.log('showChatOfUser', list[user]);
    var memoPrivateKey = document.getElementById('memo-private-key').value;
    for (var j = 0; j < keys.length; j++) {
        var cl = '';
        var key = keys[j];
        if (list[user][key]['op'][1]['from'] !== owner) {
            cl = 'in';
        } else {
            cl = 'out';
        }
        var msg = Page.getApi().memo.decode(memoPrivateKey, list[user][key]['op'][1]['memo']);
        msg = msg.substring(1);
        chat += '<div class="msg-window-chat-' + cl + '">' + msg + '</div> ';
    }

    Page.insertHTMLById('msg-window-chat', chat);
    Page.addListenerstToUsersFromChat();
}

Page.showChatsWithUsers = function() {
    console.log('showChatsWithUsers');

    var list = Page.getMsgListByAuthors();

    var users = Object.keys(list);
    var html = '';
    if (users.length) {

        for (var j = 0; j < users.length; j++) {
            var userName = users[j];
            html += '<br><span class="msg-window-user" data-user="' + userName + '">' + userName + ' (' + Object.keys(list[userName]).length + ')' + '</span> ';
        }

        Page.insertHTMLById('msg-window-users-list', html);
    }
}

Page.CheckUserTo = function(e) {
    console.log('CheckUserTo', e.target.dataset.user);

    var user = e.target.dataset.user;
    Page.showChatOfUser(user);
    Page.setTextValue('msg-to', user);
}

Page.addListenerstToUsersFromChat = function() {
    var classname = document.getElementsByClassName("msg-window-user");

    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', function(e) {
            Page.CheckUserTo(e);
        }, false);
    }
}

Page.sendMsg = function() {
    console.log('sendMsg');

    if (Page.validateIsNotEmpty(['msg-from', 'msg-to', 'msg', 'active-private-key', 'memo-private-key'])) {
        var activePrivateKey = document.getElementById('active-private-key').value;
        var memoPrivateKey = document.getElementById('memo-private-key').value;
        var payerAmount = 0.001;
        var token = document.querySelector('input[name="msg-token"]:checked').value;
        var fromUser = document.getElementById('msg-from').value;
        var toUser = document.getElementById('msg-to').value;
        var memo = '#' + document.getElementById("msg").value;
        Page.insertHTMLById('error-info', 'отправка сообщения...');

        Page.getApi().api.getAccounts([toUser], function (sendError, sendResult)
        {
            console.log(sendError, sendResult);

            if (sendError != null)
            {
                console.log('sendError', sendError);
                Page.insertHTMLById('error-info', sendError.message);
                return ;
            }

            var toUserPubKey =  sendResult[0].memo_key

            // var encoded = steem.memo.encode(memoPrivateKey, toUserPubKey, `#This is my private message`);
            var encodedMemo = Page.getApi().memo.encode(memoPrivateKey, toUserPubKey, memo);
            console.log('encodedMemo', encodedMemo);

            Page.getApi().broadcast.transfer(activePrivateKey, fromUser, toUser, payerAmount + ' ' + token, encodedMemo, function (sendError, sendResult)
            {
                console.log(sendError, sendResult);

                if (sendError != null)
                {
                    console.log('sendError', sendError);
                    Page.insertHTMLById('error-info', sendError.message);
                }
                else {
                    Page.setTextValue('msg', '');
                    Page.insertHTMLById('error-info', 'сообщение отправлено');
                }
            });
        });
    }

}



Page.validateIsNotEmpty = function(ids) {
    console.log('validateNotEmpty');

    var answer = true;
    ids = (typeof ids === 'string') ? [ids] : ids;
    for (var j = 0; j < ids.length; j++) {
        console.log(id, id);
        var id = ids[j];
        if (document.getElementById(id).value === '') {
            document.getElementById(id).classList.add("error");
            answer = false;
        } else {
            document.getElementById(id).classList.remove("error");
        }
    }

    return ids.length && answer;
}

/**
 *
 * @param array keys
 * @returns {*}
 */
Page.loadDataFromStorage = function() {
    console.log('loadDataFromStorage');

    var listMsg = {};
    if (typeof chrome !== 'undefined') {
        var keys = ['msg-from','msgListByAuthors'];

        chrome.storage.local.get(keys, function (result) {
            console.log('loadDataFromStorage', result);
            if (typeof result === 'object') {
                if (typeof result.msgListByAuthors !== 'undefined') {
                    listMsg = (result.msgListByAuthors.constructor === Object
                        && Object.keys(result.msgListByAuthors).length !== 0)
                        ? result.msgListByAuthors : {};
                    listMsg = JSON.parse(JSON.stringify(listMsg));
                }
                Page.setMsgListByAuthors(listMsg);

                if (typeof result['msg-from'] === 'string') {
                    Page.setTextValue('msg-from', result['msg-from']);
                }
            }
        });
    } else {
        Page.setMsgListByAuthors(listMsg);
    }
}

Page.storageSave = function(obj) {
    console.log('storageSave');
    if (typeof chrome !== 'undefined') {
        chrome.storage.local.set(obj, function() {
            console.log('Chrome storage got ', obj);
        });
    }
}

console.log('changePlatform');
document.addEventListener('DOMContentLoaded', function() {
    Page.loadDataFromStorage();
    Page.changePlatform();
    Page.addListenerstToUsersFromChat();

    document.getElementById('msg-from').addEventListener('change', function() {
        Page.showPayerBalance();
        Page.setMsgListByAuthors({});
        Page.getAccountMsgHistory();

        var fromUser = document.getElementById('msg-from').value;
        var data = {'msg-from': fromUser};
        Page.storageSave(data);
    }, false);

    document.getElementById('btn-show-balance').addEventListener('click', function() {
        Page.showPayerBalance();
    }, false);

    document.getElementById('btn-send').addEventListener('click', function() {
        Page.sendMsg();
    }, false);

    document.getElementById('btn-show-msg-history').addEventListener('click', function() {
        Page.getAccountMsgHistory();
    }, false);



}, false);
