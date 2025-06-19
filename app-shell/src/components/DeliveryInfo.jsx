/* eslint-disable react/prop-types */

const getDeliveryDate = (offsetDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const countdownToCutoff = () => {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(23, 59, 0, 0);
  const diff = cutoff - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} hrs ${minutes} mins`;
};

const DeliveryInfo = ({ hasPremium }) => {
  return (
    <div  className="delivery-info ">
      <div><span className="highlight">FREE Returns</span></div>

      {hasPremium ? (
        <>
          <div style={{ marginTop: '8px' }}>
            <span className="highlight">FREE delivery</span> <strong>{getDeliveryDate(2)}</strong>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#565959' }}>
            Or fastest delivery <strong>{getDeliveryDate(1)}</strong>. Order within{' '}
            <span style={{ color: '#007600' }}>{countdownToCutoff()}</span>
          </div>
        </>
      ) : (
        <div style={{ marginTop: '8px' }}>
          <span className="highlight">Standard delivery</span> <strong>{getDeliveryDate(5)}</strong>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
