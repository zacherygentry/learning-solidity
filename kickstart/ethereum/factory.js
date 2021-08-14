import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xC4F6fFd832a8c475de2637f184f2Ea45D847501c'
);

export default instance;
