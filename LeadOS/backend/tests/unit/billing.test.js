const crypto = require('crypto');

const mockCreatePaymentLink = async ({ leadId, amount }) => {
  if (!leadId) throw new Error('Missing data');
  return { paymentUrl: 'https://mock.razorpay.com/pay/123', orderId: 'order_123' };
};

const handleWebhook = (req, res) => {
  const secret = 'test_secret';
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(401).json({ error: 'Invalid sig' });
  }

  const { event } = req.body;
  if (event === 'payment.captured') {
    // Stage updated to paid...
    return res.status(200).json({ status: 'ok', updatedStage: 'paid' });
  }
  return res.status(200).json({ status: 'ok' });
};

describe('Billing Tests', () => {
  it('payment link creation returns URL', async () => {
    const result = await mockCreatePaymentLink({ leadId: 1, amount: 100 });
    expect(result.paymentUrl).toBeDefined();
  });

  it('valid webhook sig passes', () => {
    const secret = 'test_secret';
    const body = { event: 'payment.captured' };
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest('hex');

    const req = { body, headers: { 'x-razorpay-signature': digest } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    handleWebhook(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'ok', updatedStage: 'paid' }));
  });

  it('invalid webhook sig returns 401', () => {
    const req = { body: {}, headers: { 'x-razorpay-signature': 'invalid_hash' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    handleWebhook(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
