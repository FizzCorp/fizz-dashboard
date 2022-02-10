// imports
const BillingPlan = require('../../constants.js').billingPlan;

// helper methods
const mergeDefaultPlan = (dbPlan) => {
  const merged = {
    ...BillingPlan,
    ...dbPlan
  };
  return Promise.resolve(merged);
};

// model extension
function extend(Company) {
  Company.updateMeta = (companyId, meta) => Company.findByPk(companyId)
    .then((company) => {
      const companyMeta = company ? company.meta : {};
      const values = {
        id: companyId,
        meta: { ...companyMeta, ...meta }
      };
      return company ? company.update(values) : Company.create({ ...values, billing_plan: {} });
    })
    .then(res => meta);

  Company.getBillingPlan = companyId => Company.findByPk(companyId)
    .then((company) => {
      if (company) {
        return mergeDefaultPlan(company.billing_plan);
      }
      return Promise.reject('Company not Found!');
    })
    .catch(error => mergeDefaultPlan({}));

  Company.setBillingPlan = (companyId, billingPlan) => Company.findByPk(companyId)
    .then((company) => {
      const values = {
        id: companyId,
        billing_plan: billingPlan
      };
      return company ? company.update(values) : Company.create({ ...values, meta: {} });
    })
    .then(res => billingPlan);
};

// exports
module.exports = {
  extend: extend
};