import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  console.log('Creating UAE7Guard subscription products in Stripe...');
  
  const stripe = await getUncachableStripeClient();

  // Check if products already exist
  const existingProducts = await stripe.products.search({ query: "metadata['app']:'uae7guard'" });
  if (existingProducts.data.length > 0) {
    console.log('Products already exist, skipping creation');
    console.log('Existing products:', existingProducts.data.map(p => p.name));
    return;
  }

  // Create Basic Plan - $4.99/month
  const basicProduct = await stripe.products.create({
    name: 'Basic Plan',
    description: 'Unlimited wallet checks, watchlist (10 addresses), email alerts, priority report submission',
    metadata: {
      app: 'uae7guard',
      tier: 'basic',
      features: JSON.stringify([
        'Unlimited wallet checks',
        'Watchlist (up to 10 addresses)',
        'Email alerts for flagged addresses',
        'Report submission priority'
      ])
    }
  });

  const basicMonthlyPrice = await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 499, // $4.99
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'basic', billing: 'monthly' }
  });

  const basicYearlyPrice = await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 4990, // $49.90/year (save ~$10)
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { tier: 'basic', billing: 'yearly' }
  });

  console.log('Created Basic Plan:', basicProduct.id);
  console.log('  Monthly price:', basicMonthlyPrice.id, '($4.99/month)');
  console.log('  Yearly price:', basicYearlyPrice.id, '($49.90/year)');

  // Create Pro Plan - $14.99/month
  const proProduct = await stripe.products.create({
    name: 'Pro Plan',
    description: 'Everything in Basic + unlimited watchlist, AI predictions, real-time monitoring, API access, priority support',
    metadata: {
      app: 'uae7guard',
      tier: 'pro',
      features: JSON.stringify([
        'Everything in Basic',
        'Unlimited watchlist addresses',
        'AI-powered risk predictions',
        'Real-time monitoring',
        'API access (for developers)',
        'Priority support',
        'Export reports'
      ])
    }
  });

  const proMonthlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 1499, // $14.99
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { tier: 'pro', billing: 'monthly' }
  });

  const proYearlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 14990, // $149.90/year (save ~$30)
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { tier: 'pro', billing: 'yearly' }
  });

  console.log('Created Pro Plan:', proProduct.id);
  console.log('  Monthly price:', proMonthlyPrice.id, '($14.99/month)');
  console.log('  Yearly price:', proYearlyPrice.id, '($149.90/year)');

  console.log('\nAll products created successfully!');
  console.log('\nPrices for checkout:');
  console.log('  Basic Monthly:', basicMonthlyPrice.id);
  console.log('  Basic Yearly:', basicYearlyPrice.id);
  console.log('  Pro Monthly:', proMonthlyPrice.id);
  console.log('  Pro Yearly:', proYearlyPrice.id);
}

createProducts().catch(console.error);
