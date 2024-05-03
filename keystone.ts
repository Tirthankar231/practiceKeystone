// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

// to keep this file tidy, we define our schema in a different file
import { lists } from './schema';
import bodyParser from 'body-parser';


// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: 'postgresql',
      url: 'postgres://postgres:Tirtha@4321@localhost:5432/keystone',
      onConnect: async context => { /* ... */ },
      // Optional advanced configuration
      enableLogging: true,
      idField: { kind: 'uuid' },
      shadowDatabaseUrl: 'postgres://postgres:Tirtha@4321@localhost:5432/shadowdb'
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use(bodyParser.json());
      
        // Define your custom API endpoint for creating orders
        app.post('/rest/orders', async (req, res) => {
          try {
            // Ensure the request has a valid context
            const context = await commonContext.withRequest(req, res);
      
            // Extract order data from the request body
            const { orderId, currency, value, bff, collectedBy, paymentType, state } = req.body;
      
            // Create the order using the extracted data
            const order = await context.query.Order.createOne({
              data: {
                orderId,
                currency,
                value,
                bff,
                collectedBy,
                paymentType,
                state,
              },
            });
      
            // Return the created order as JSON response
            res.json(order);
          } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        });
        // Define your custom API endpoint for fetching a specific order
        app.get('/rest/orders/:orderId', async (req, res) => {
          try {
            // Ensure the request has a valid context
            const context = await commonContext.withRequest(req, res);

            // Extract the orderId from the request parameters
            const { orderId } = req.params;

            // Fetch the order using the orderId
            const order = await context.query.Order.findOne({
              where: { id: orderId },
              // Include any additional fields you want to retrieve
              // For example: select: 'orderId currency value paymentType state'
            });

            // Check if the order exists
            if (!order) {
              return res.status(404).json({ error: 'Order not found' });
            }

            // Return the order as JSON response
            res.json(order);
          } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching order:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        });
        // Define your custom API endpoint for fetching all orders
        app.get('/rest/orders', async (req, res) => {
          try {
            // Ensure the request has a valid context
            const context = await commonContext.withRequest(req, res);

            // Fetch all orders including all fields
            const orders = await context.query.Order.findMany({
              query: 'orderId currency value bff collectedBy paymentType createdAt state updatedAt seller { name } settlementDetails { settlementType accountNo bankName branchName }',
            });

            // Check if any orders were found
            if (!orders || orders.length === 0) {
              return res.status(404).json({ error: 'No orders found' });
            }

            // Return the orders as JSON response
            res.json(orders);
          } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        });
      },
    },      
    lists,
    session,
  })
);
