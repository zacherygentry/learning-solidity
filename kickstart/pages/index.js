import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CampaignIndex = ({ campaigns }) => {
  const router = useRouter();

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
      <Link href='/campaigns/new'>
        <a>
          {' '}
          <Button
            floated='right'
            content='Create Campaign'
            icon='add circle'
            primary
          />
        </a>
      </Link>

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
