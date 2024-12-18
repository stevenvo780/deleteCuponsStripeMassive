require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function deleteCouponsByName(couponName) {
  let hasMore = true;
  let lastCouponId;

  while (hasMore) {
    const params = { limit: 100 };
    if (lastCouponId) params.starting_after = lastCouponId;

    const response = await stripe.coupons.list(params);

    const matchingCoupons = response.data.filter(
      (coupon) => coupon.name === couponName
    );

    for (const coupon of matchingCoupons) {
      console.log(`Deleting coupon: ${coupon.id}`);
      await stripe.coupons.del(coupon.id);
    }

    hasMore = response.has_more;
    lastCouponId = response.data.length > 0 ? response.data[response.data.length - 1].id : null;
  }

  console.log('All matching coupons have been deleted.');
}

deleteCouponsByName('Garmin discount');
