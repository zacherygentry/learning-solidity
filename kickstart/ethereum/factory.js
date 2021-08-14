import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x7b7aB9052826C07c4A54DAEfA68Ec0491064eD04'
);

export default instance;
