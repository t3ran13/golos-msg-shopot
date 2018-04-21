function Page() {
    var api = null;
    var rewardPerUser = null;
    var UsersAskedReward = null;
}

var Page = new Page();

Page.setApi = function(platform) {
    console.log('setApi');

    if (platform === 'golos') {
        api = golos;
    } else {
        api = steem;
        steem.api.setOptions({ url: 'https://api.steemit.com' });
    }
}

Page.getApi = function() {
    console.log('getApi');

    return api;
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
        if (err) {
            alert('error');
            return [];
        }

        field.innerHTML = result[0].balance + ' and ' + result[0].sbd_balance;
    });
}

Page.getAccountMsgHistory = function() {
    console.log('getAccountMsgHistory');

    var user = document.getElementById('msg-from').value;
    var interval = document.querySelector('input[name="history-interval"]:checked').value;
    field.innerHTML = '~';

    Page.getApi().api.getAccounts([user], function(err, result) {
        console.log('showPayerBalance',user);
        console.log(err, result);
        if (err) {
            alert('error');
            return [];
        }

        field.innerHTML = result[0].balance + ' and ' + result[0].sbd_balance;
    });
}

console.log('changePlatform');
document.addEventListener('DOMContentLoaded', function() {
    Page.changePlatform();

    document.getElementById('btn-show-balance').addEventListener('click', function() {
        Page.showPayerBalance();
    }, false);

    document.getElementById('btn-show-msg-history').addEventListener('click', function() {
        Page.getAccountMsgHistory();
    }, false);
}, false);

// Page.changeMoneyDistribution = function() {
//     console.log('changeMoneyDistribution');
//
//     // Page.updateRewardPerUser();
//
//     Page.showRewardSum();
// }

// Page.updateRewardPerUser = function() {
//     console.log('updateRewardPerUser');
//
//     var dist = document.querySelector('input[name="payer-money-distribution"]:checked').value;
//     var amt = document.getElementById('payer-amount').value;
//     amt = Number(amt.trim()).toFixed(3);
//     var list = Page.getCheckedUsers();
//
//     if (dist === 'all') {
//         if (list.length > 0) {
//             rewardPerUser = (amt / list.length).toFixed(3) ;
//         } else {
//             rewardPerUser = (0).toFixed(3) ;
//         }
//     } else {
//         rewardPerUser = amt;
//     }
// }

// Page.showRewardSum = function() {
//     console.log('showRewardSum');
//
//     var el = document.getElementById('money-distribution-info-1');
//     var el2 = document.getElementById('money-distribution-info-2');
//     if (el != null) {
//         var amt = Page.getRewardPerUser();
//         var list = Page.getCheckedUsers();
//         var kind = document.getElementById('payer-amount-kind').value;
//         el.innerHTML = rewardPerUser + ' ' + kind;
//         html = '';
//
//         if (list.length > 0) {
//             html += (amt * list.length).toFixed(3) ;
//         } else {
//             html += (0).toFixed(3) ;
//         }
//
//         el2.innerHTML = html + ' ' + kind;
//     }
// }
//
// Page.showRewardPost = function(reward) {
//     console.log('showRewardPost');
//
//     var el = document.getElementById('post-reward-info');
//     el.innerHTML = 'Полная награда за пост: ' + reward;
// }
//
// Page.changeCheckedUsersSum = function() {
//     console.log('showCheckedUsersSum');
//
//     var q = 0;
//     var list = Page.getCheckedUsers();
//
//     document.getElementById('total-checked-users').innerHTML = list.length;
// }
//
// Page.getRewardPerUser = function() {
//     console.log('getRewardPerUser');
//
//     return rewardPerUser;
// }
//
// Page.changeUserCheckbox = function() {
//     console.log('changeUserCheckbox');
//
//     Page.changeCheckedUsersSum();
//     Page.changeMoneyDistribution();
// }

// Page.displaySelectCurrency = function(platform) {
//     console.log('displaySelectCurrency');
//
//     var e = document.getElementById("payer-amount-kind");
//     var selected = e.options[e.selectedIndex].value;
//
//     if (platform === 'golos') {
//         document.querySelector('option[value="SBD"]').style.display = "none";
//         document.querySelector('option[value="STEEM"]').style.display = "none";
//         document.querySelector('option[value="STEEMPOWER"]').style.display = "none";
//         document.querySelector('option[value="GBG"]').style.display = "block";
//         document.querySelector('option[value="GOLOS"]').style.display = "block";
//         document.querySelector('option[value="GOLOSPOWER"]').style.display = "block";
//
//         if (['SBD','STEEM','STEEMPOWER'].indexOf(selected)) {
//             document.querySelector('option[value="GOLOSPOWER"]').selected = "selected";
//         }
//     } else {
//         document.querySelector('option[value="SBD"]').style.display = "block";
//         document.querySelector('option[value="STEEM"]').style.display = "block";
//         document.querySelector('option[value="STEEMPOWER"]').style.display = "block";
//         document.querySelector('option[value="GBG"]').style.display = "none";
//         document.querySelector('option[value="GOLOS"]').style.display = "none";
//         document.querySelector('option[value="GOLOSPOWER"]').style.display = "none";
//
//         if (['GBG','GOLOS','GOLOSPOWER'].indexOf(selected)) {
//             document.querySelector('option[value="STEEMPOWER"]').selected = "selected";
//         }
//     }
// }

// Page.rewardUsers = function() {
//     console.log('rewardUsers');
//
//     if (
//         Page.getPayer() === ''
//         || document.getElementById('active-private-key').value === ''
//         || document.getElementById('payer-amount').value === ''
//     ) {
//         alert('Заполните все поля/ Fill all fields');
//         return;
//     }
//
//     var list = document.getElementsByClassName("rewarded-user");
//     Array.from(list).forEach(function(checkbox) {
//         if (checkbox.checked) {
//             Page.rewardUser(checkbox.id);
//         }
//     });
// }
//
// Page.getPayer = function() {
//     return document.getElementById('msg-from').value;
// }
//
// Page.rewardUser = function(user) {
//     console.log('rewardUser');
//     var from = Page.getPayer();
//     var wif = document.getElementById('active-private-key').value;
//     var amt = Page.getRewardPerUser();
//     var kind = document.getElementById('payer-amount-kind').value;
//     var to = user;
//     var td = document.getElementById('user-status-' + to);
//
//
//
//     amt.trim()
//     if (kind === 'GOLOSPOWER' || kind === 'STEEMPOWER') {
//
//         console.log('from', from);
//         console.log('to', to);
//         console.log('amt', amt);
//
//         td.innerHTML = '~';
//
//         var currency = kind === 'STEEMPOWER' ? 'STEEM' : 'GOLOS';
//
//         Page.getApi().broadcast.transferToVesting(wif, from, to, amt + ' ' + currency, function (sendError, sendResult)
//         {
//             console.log(sendError, sendResult);
//
//             if (sendError != null)
//             {
//                 console.log('sendError', sendError);
//                 td.innerHTML = 'ERROR';
//             }
//             else {
//                 td.innerHTML = 'sent ' + amt + ' ' + kind;
//             }
//         });
//     } else {
//         var memo = document.getElementById('msg').value;
//         memo = memo.replace('{post_link}', document.getElementById('post-url').value);
//
//         console.log('from', from);
//         console.log('to', to);
//         console.log('amt', amt);
//         console.log('memo', memo);
//         td.innerHTML = '~';
//
//         Page.getApi().broadcast.transfer(wif, from, to, amt + ' ' + kind, memo, function (sendError, sendResult)
//         {
//             console.log(sendError, sendResult);
//
//             if (sendError != null)
//             {
//                 console.log('sendError', sendError);
//                 td.innerHTML = 'ERROR';
//             }
//             else {
//                 td.innerHTML = 'sent ' + amt + ' ' + kind;
//             }
//         });
//     }
// }
//
// Page.showListRepostedUsers = function() {
//     console.log('showListRepostedUsers');
//
//     document.getElementById('users-list').innerHTML = '';
//
//
//     Page.validateFromLink();
//     Page.validateNotEmpty('active-private-key');
//     Page.validateNotEmpty('msg-from');
//     Page.validateNotEmpty('payer-amount');
//
//     var urlInfo = Page.getInfoFromLink();
//     if (typeof urlInfo.golos_user === 'undefined') {
//         Page.getApi().api.getContent(urlInfo.author, urlInfo.permlink, function(err, result) {
//             console.log('getContent');
//             console.log(err, result);
//             if (err) {
//                 alert('error');
//                 return [];
//             }
//
//             var listMention = [];
//             if (typeof result.json_metadata != 'undefined') {
//                 var meta = JSON.parse(result.json_metadata);
//                 if (typeof meta.users != 'undefined') {
//                     listMention = meta.users;
//                 }
//             }
//             Page.showUsersList(listMention);
//
//             var listReward = [];
//             if (typeof result.active_votes != 'undefined') {
//                 result.active_votes.forEach(function(obj) {
//                     if (listMention.indexOf(obj.voter) > 0 && obj.percent > 0) {
//                         listReward.push(obj.voter);
//                     }
//                 });
//             }
//             Page.setUsersAskedReward(listReward);
//
//             if (typeof result.total_payout_value != 'undefined') {
//                 var reward = Number(result.total_payout_value.split(' ')[0].trim()).toFixed(3)
//                 - Number(result.curator_payout_value.split(' ')[0].trim()).toFixed(3);
//                 Page.showRewardPost(reward + ' SBD');
//             }
//         });
//     }
// }
//
// Page.getInfoFromLink = function() {
//     console.log('getInfoFromLink');
//
//     //hack
//     var a = document.createElement('a');
//     var url = document.getElementById('post-url').value;
//     a.href = url;
//
//     var data = {};
//     if (url.length > 0) {
//         data.path = a.pathname;
//         var parts = data.path.substring(data.path.indexOf('/@') + 2).split('/');
//         data.author = parts[0];
//         data.permlink = parts[1];
//     }
//
//     console.log('data', data);
//
//     return data;
// }
//
// Page.validateFromLink = function() {
//     console.log('validateFromLink');
//     var urlInfo = Page.getInfoFromLink();
//     if (typeof urlInfo.author === 'undefined') {
//         document.getElementById('post-url').classList.add("error");
//     } else {
//         document.getElementById('post-url').classList.remove("error");
//     }
// }
//
// Page.validateNotEmpty = function(id) {
//     console.log('validateNotEmpty');
//     if (document.getElementById(id).value === '') {
//         document.getElementById(id).classList.add("error");
//     } else {
//         document.getElementById(id).classList.remove("error");
//     }
// }
//
// Page.getUsersFromRating = function (query) {
//     console.log('getUsersFromRating');
//     console.log(query);
//
// }
//
// Page.showUsersList = function(list) {
//     console.log('showUsersList', list);
//
//     var html = '<table id="table-with-users">';
//     html += '<tr>';
//     html += '<td colspan="2">';
//     html += 'Каждому пользователю/ Each user:';
//     html += '</td>';
//     html += '<td>';
//     html += '</td>';
//     html += '<td>';
//     html += '<span id="money-distribution-info-1">~</span>';
//     html += '</td>';
//     html += '</tr>';
//     html += '<tr>';
//     html += '<td colspan="2">';
//     html += 'Всего/ Total:';
//     html += '</td>';
//     html += '<td>';
//     html += '</td>';
//     html += '<td>';
//     html += '<span id="money-distribution-info-2">~</span>';
//     html += '</td>';
//     html += '</tr>';
//
//     html += '<tr>';
//     html += '<td colspan="4">';
//     html += '<span id="post-reward-info">~</span>';
//     html += '</td>';
//     html += '</tr>';
//
//     html += '<tr>';
//     html += '<td colspan="4">';
//     html += '<input type="submit" class="submit-data" value="скрыть отказавшихся от выплат/ hide who didnot upvote" onclick="Page.showUsersAskedReward();">';
//     html += '</td>';
//     html += '</tr>';
//
//     html += '<tr>';
//     html += '<td>';
//     html += '<span class="checkbox-set-all" onclick="Page.pressAll();">Все<br>/All</span>'
//     html += '</td>';
//     html += '<td>';
//     html += '</td>';
//     html += '<td>';
//     html += '</td>';
//     html += '<td>';
//     html += 'Всего/ Total: <span id="total-checked-users">~</span>';
//     html += '</td>';
//     html += '</tr>';
//     list.forEach(function(user) {
//         if (user === 'surfermarly') {
//             //crazy bitch
//             return;
//         }
//         html += '<tr>';
//         html += '<td>';
//         html += '<input type="checkbox" checked="checked" class="rewarded-user" onchange="Page.changeUserCheckbox();" id="' + user + '">';
//         html += '</td>';
//         html += '<td>';
//         html += user;
//         html += '</td>';
//         html += '<td id="user-status-' + user + '">';
//         html += '0';
//         html += '</td>';
//         html += '<td>';
//         html += '<input type="submit" class="submit-data" value="Вознаградить/ Reward" onclick="Page.rewardUser(\'' + user + '\');">';
//         html += '</td>';
//         html += '</tr>';
//     });
//     html += '<tr>';
//     html += '<td colspan="4">';
//     html += '<input type="submit" class="submit-data" value="Вознаградить выбранных/ Reward checked" onclick="Page.rewardUsers();">';
//     html += '</td>';
//     html += '</tr>';
//     html += '</table>';
//
//     document.getElementById('users-list').innerHTML = html;
//
//     Page.changeUserCheckbox();
// }
//
//
//
// Page.pressAll = function() {
//     console.log('pressAll');
//
//     var list = document.getElementsByClassName("rewarded-user");
//     var isAllSelected = false;
//     Array.from(list).forEach(function(checkbox) {
//         if (!checkbox.checked) {
//             checkbox.checked = true;
//             isAllSelected = true;
//         }
//     });
//
//     if (!isAllSelected) {
//         Array.from(list).forEach(function(checkbox) {
//             if (checkbox.checked) {
//                 checkbox.checked = false;
//             }
//         });
//     }
//     isAllSelected = false;
//
//
//     Page.changeUserCheckbox();
// }
//
//
//
// Page.getCheckedUsers = function() {
//     console.log('getCheckedUsers');
//     var listChecked = [];
//
//     var list = document.getElementsByClassName("rewarded-user");
//     if (list != null && list.length > 0) {
//         Array.from(list).forEach(function(checkbox) {
//             if (checkbox.checked === true) {
//                 listChecked.push(checkbox);
//             }
//         });
//     }
//
//     return listChecked;
// }
//
// Page.showUsersAskedReward = function() {
//     console.log('showUsersAskedReward');
//
//     var list = document.getElementsByClassName("rewarded-user");
//     var listReward = Page.getUsersAskedReward();
//     if (list != null && list.length > 0) {
//         Array.from(list).forEach(function(checkbox) {
//             if (checkbox.checked === true && listReward.indexOf(checkbox.id) === -1) {
//                 checkbox.checked = false;
//             }
//         });
//     }
//
//     Page.changeUserCheckbox();
// }

// window.onload = function () {
//     Page.changePlatform();
// }