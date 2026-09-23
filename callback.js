'use strict';
const query = new URLSearchParams(window.location.search);
const code = query.get('code');
const shopId = query.get('shop_id');
const mainAccountId = query.get('main_account_id');
const error = query.get('error');
window.history.replaceState(null, '', window.location.pathname + window.location.hash);

const status = document.getElementById('status');
if (error) {
  status.textContent = '認可が完了しませんでした。App側の認可状態を確認してください。';
} else if (code && code.length <= 2048 && ((shopId && /^\d+$/.test(shopId)) || (mainAccountId && /^\d+$/.test(mainAccountId)))) {
  status.textContent = '認可コードを受け取りました。';
  document.getElementById('code').textContent = code;
  document.getElementById('account').textContent = shopId ? 'Shop ID: ' + shopId : 'Main Account ID: ' + mainAccountId;
} else {
  status.textContent = '認可情報がありません。ShopeeのApp画面から認可を開始してください。';
}
