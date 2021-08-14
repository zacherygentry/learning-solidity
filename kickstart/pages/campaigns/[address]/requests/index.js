import { Button } from 'semantic-ui-react';
import Link from 'next/link';
import Campaign from '../../../../ethereum/campaign';
import { Table } from 'semantic-ui-react';
import RequestRow from '../../../../components/RequestRow';

const RequestAddress = ({
  address,
  requests,
  requestCount,
  approversCount,
}) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          id={index}
          key={index}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };
  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated='right' style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (ether)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </>
  );
};

export default RequestAddress;

export async function getServerSideProps(context) {
  const { address } = context.query;
  const campaign = Campaign(address);

  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  let requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  requests = requests.map((r) => JSON.parse(JSON.stringify(r)));

  return {
    props: {
      address,
      requests,
      requestCount,
      approversCount,
    },
  };
}
