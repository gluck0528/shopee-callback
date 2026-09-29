'use strict';
// Only this SellSmart deployment may receive an authorization code.
const callbackUrl = 'https://script.google.com/macros/s/AKfycby_vNFsAZwniihEHBb6-_bqFvVS5YsBAMMJcvuwAGsto416km0L0fRRpLq4PKljLzz9/exec';
const query = new URLSearchParams(window.location.search);
const code = query.get('code');
const shopId = query.get('shop_id');
const mainAccountId = query.get('main_account_id');
const state = query.get('ss_state');
const callback = query.get('callback');
const error = query.get('error');
window.history.replaceState(null, '', window.location.pathname + window.location.hash);

const status = document.getElementById('status');
const validCode = code && code.length <= 2048 && !/[\s\u0000-\u001f\u007f]/.test(code);
const validShop = shopId && /^[1-9]\d{0,15}$/.test(shopId);
if (error) {
  status.textContent = '認可が完了しませんでした。SellSmartから認可リンクを作り直してください。';
} else if (callback) {
  if (callback !== callbackUrl || !state || !/^[A-Za-z0-9_-]{16,128}$/.test(state) || !validCode || !validShop) {
    status.textContent = mainAccountId ? 'ショップアカウントでログインし直してください。現在はショップごとの接続に対応しています。' : '認可情報を確認できません。SellSmartからリンクを作り直してください。';
  } else {
    status.textContent = 'SellSmartにショップを接続しています。しばらくお待ちください。';
    const destination = new URL(callbackUrl);
    destination.searchParams.set('state', state);
    destination.searchParams.set('code', code);
    destination.searchParams.set('shop_id', shopId);
    window.location.replace(destination.href);
  }
} else if (validCode && (validShop || (mainAccountId && /^\d+$/.test(mainAccountId)))) {
  status.textContent = '認可コードを受け取りました。SellSmartの手動入力欄に貼り付けてください。';
  document.getElementById('code').textContent = code;
  document.getElementById('account').textContent = validShop ? 'Shop ID: ' + shopId : 'Main Account ID: ' + mainAccountId;
} else {
  status.textContent = '認可情報がありません。SellSmartのショップ連携ボタンから開始してください。';
}
