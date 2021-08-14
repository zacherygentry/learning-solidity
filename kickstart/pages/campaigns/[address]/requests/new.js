import web3 from '../../../../ethereum/web3';
import Campaign from '../../../../ethereum/campaign';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useState } from 'react';

const RequestNew = ({ address }) => {
  const router = useRouter();
  const [descripton, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    try {
      setLoading(true);
      await campaign.methods
        .createRequest(descripton, web3.utils.toWei(value, 'ether'), recipient)
        .send({
          from: accounts[0],
        });
      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Link href={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={Boolean(errorMessage)}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={descripton}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Message error header='Oops!' content={errorMessage}></Message>
        <Button primary loading={loading}>
          Create!
        </Button>
      </Form>
    </>
  );
};

export default RequestNew;

export async function getServerSideProps(context) {
  const { address } = context.query;

  return {
    props: {
      address: address,
    },
  };
}
