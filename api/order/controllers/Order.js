"use strict";
const stripe = require("stripe")("YOUR_STRAPI_SECRET_API_KEY");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/guides/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const { name, total, items, stripeTokenId } = ctx.request.body;
    const { id } = ctx.state.user;
    console.log(ctx.request.body);

    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: total * 100,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user.username}`,
      source: stripeTokenId,
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: id,
      name,
      total,
      items,
    });

    return order;
  },
};
