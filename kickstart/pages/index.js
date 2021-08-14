import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';

const CampaignIndex = ({ campaigns }) => {
  const renderCampaigns = () => {
    const items = campaigns.map((campaign) => {
      return {
        header: campaign,
        description: (
          <Link href={`/campaigns/${campaign}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Button
        floated='right'
        content='Create Campaign'
        icon='add circle'
        primary
      />
      {renderCampaigns()}
    </div>
  );
};

export default CampaignIndex;

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return {
    props: {
      campaigns,
    },
  };
}
