"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  User: (0, import_core.list)({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: import_access.allowAll,
    //     access: {
    //   operation: {
    //     query: ({ session }) => isNormalUser({ session }),
    //     create: ({ session }) => isNormalUser({ session }),
    //     update: ({ session }) => isNormalUser({ session }),
    //     delete: ({ session }) => isAdmin({ session }),
    //   },
    // },
    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      role: (0, import_fields.select)({
        options: ["admin", "user"],
        // Define enum options
        defaultValue: "user",
        // Set default value
        ui: {
          displayMode: "segmented-control"
          // Display as segmented control in the UI
        }
      }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    },
    ui: {
      // Hide the delete action from the UI
      hideDelete: true
    }
  }),
  Order: (0, import_core.list)({
    access: import_access.allowAll,
    // access: {
    //   operation: {
    //     query: ({ session }) => !!session, // All users can query
    //     create: ({ session }) => session.data.role === 'admin', // Only admin can create
    //     update: ({ session }) => session.data.role === 'admin', // Only admin can update
    //     delete: ({ session }) => session.data.role === 'admin', 
    //   },
    // },
    fields: {
      orderId: (0, import_fields.text)({ validation: { isRequired: true } }),
      currency: (0, import_fields.text)({ validation: { isRequired: true } }),
      value: (0, import_fields.text)({ validation: { isRequired: true } }),
      bff: (0, import_fields.text)(),
      collectedBy: (0, import_fields.text)(),
      paymentType: (0, import_fields.text)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      state: (0, import_fields.text)({ validation: { isRequired: true } }),
      updatedAt: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      // Establishing N:1 relationship with Seller
      seller: (0, import_fields.relationship)({ ref: "Seller.orders", many: false }),
      // Establishing 1:1 relationship with Settlement_Details
      settlementDetails: (0, import_fields.relationship)({ ref: "Settlement_Details.order", many: false }),
      relatedLinks: (0, import_fields.json)({
        ui: {
          views: "./components/component.tsx",
          createView: { fieldMode: "edit" },
          listView: { fieldMode: "hidden" },
          itemView: { fieldMode: "edit" }
        }
      })
    }
  }),
  Seller: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      gst: (0, import_fields.text)(),
      pan: (0, import_fields.text)(),
      bpp_id: (0, import_fields.text)(),
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      // Establishing 1:N relationship with Order
      orders: (0, import_fields.relationship)({ ref: "Order.seller", many: true })
    }
  }),
  Settlement_Details: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      settlementType: (0, import_fields.text)({ validation: { isRequired: true } }),
      accountNo: (0, import_fields.text)(),
      bankName: (0, import_fields.text)(),
      branchName: (0, import_fields.text)(),
      // Establishing 1:1 relationship with Order
      order: (0, import_fields.relationship)({ ref: "Order.settlementDetails", many: false })
    }
  })
};

// keystone.ts
var import_body_parser = __toESM(require("body-parser"));

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "id name email role",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password", "role"],
    itemData: { isAdmin: true }
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "postgresql",
      url: "postgres://postgres:Tirtha@4321@localhost:5432/keystone",
      onConnect: async (context) => {
      },
      // Optional advanced configuration
      enableLogging: true,
      idField: { kind: "uuid" },
      shadowDatabaseUrl: "postgres://postgres:Tirtha@4321@localhost:5432/shadowdb"
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use(import_body_parser.default.json());
        app.post("/rest/orders", async (req, res) => {
          try {
            const context = await commonContext.withRequest(req, res);
            const { orderId, currency, value, bff, collectedBy, paymentType, state } = req.body;
            const order = await context.query.Order.createOne({
              data: {
                orderId,
                currency,
                value,
                bff,
                collectedBy,
                paymentType,
                state
              }
            });
            res.json(order);
          } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        });
        app.get("/rest/orders/:orderId", async (req, res) => {
          try {
            const context = await commonContext.withRequest(req, res);
            const { orderId } = req.params;
            const order = await context.query.Order.findOne({
              where: { id: orderId }
              // Include any additional fields you want to retrieve
              // For example: select: 'orderId currency value paymentType state'
            });
            if (!order) {
              return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
          } catch (error) {
            console.error("Error fetching order:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        });
        app.get("/rest/orders", async (req, res) => {
          try {
            const context = await commonContext.withRequest(req, res);
            const orders = await context.query.Order.findMany({
              query: "orderId currency value bff collectedBy paymentType createdAt state updatedAt seller { name } settlementDetails { settlementType accountNo bankName branchName }"
            });
            if (!orders || orders.length === 0) {
              return res.status(404).json({ error: "No orders found" });
            }
            res.json(orders);
          } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        });
      }
    },
    lists,
    session
  })
);
//# sourceMappingURL=config.js.map
