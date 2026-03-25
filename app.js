function app(){
 return {
 page:'landing',
 section:'dashboard',

 usd:0,
 inr:0,
 pending:0,

 amount:0,
 withdrawAmt:0,

 txs:[],
 withdrawals:[],

 coin:'usdt',

 rates:{
  usdt:83,
  btc:0,
  eth:0,
  sol:0,
  trx:0
 },

 get convertedINR(){
  return this.amount * (this.rates[this.coin] || 0);
 },

 tab(s){
  return this.section===s ? 'active-tab block' : 'block';
 },

 submit(){
  if(this.amount < 500) return alert('Minimum $500');

  this.pending++;

  this.txs.push({
    id: Date.now(),
    amount: this.amount,
    coin: this.coin,
    status: 'pending'
  });
 },

 approveTx(i){
  const tx = this.txs[i];
  if(!tx || tx.status==='approved') return;

  this.usd += tx.amount;
  this.inr += tx.amount * this.rates[tx.coin];

  tx.status = 'approved';
  this.pending--;
 },

 withdraw(){
  if(this.withdrawAmt > this.inr){
    return alert('Insufficient balance');
  }

  this.inr -= this.withdrawAmt;
  this.withdrawals.push(this.withdrawAmt);
 },

 async fetchPrices(){
  try{
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tron,tether&vs_currencies=inr');
    const data = await res.json();

    this.rates.btc = data.bitcoin.inr;
    this.rates.eth = data.ethereum.inr;
    this.rates.sol = data.solana.inr;
    this.rates.trx = data.tron.inr;
    this.rates.usdt = data.tether.inr;
  }catch(e){
    console.log(e);
  }
 },

 init(){
  const saved = localStorage.getItem('cryptoApp');

  if(saved){
    Object.assign(this, JSON.parse(saved));
  }

  this.fetchPrices();

  setInterval(()=>this.fetchPrices(), 30000);

  this.$watch(
    () => [this.usd, this.inr, this.txs, this.withdrawals],
    () => {
      localStorage.setItem('cryptoApp', JSON.stringify({
        usd:this.usd,
        inr:this.inr,
        txs:this.txs,
        withdrawals:this.withdrawals
      }));
    }
  );
 },

 logout(){
  this.page='landing';
 }
 }
}
