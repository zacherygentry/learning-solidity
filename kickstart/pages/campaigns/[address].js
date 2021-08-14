import { useRouter } from 'next/router';

const CampaignAddress = () => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <>
      <h3>Campaign Details</h3>
    </>
  );
};
export default CampaignAddress;
