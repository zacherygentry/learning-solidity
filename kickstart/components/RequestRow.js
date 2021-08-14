import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { useRouter } from 'next/router';

const RequestRow = ({ request, address, id, approversCount }) => {
  const router = useRouter();
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const onApprove = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });
      router.reload(window.location.pathname);
    } catch (err) {}
  };

  const onFinalize = async () => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0],
      });
      router.reload(window.location.pathname);
    } catch (err) {}
  };

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button color='green' basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {!request.complete && (
          <Button color='teal' basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};
export default RequestRow;
