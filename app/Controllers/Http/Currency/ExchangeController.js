'use strict'

const CurrencyService = use('App/Services/CurrencyService');
const CustomHttpException = use('App/Exceptions/CustomHttpException');

class ExchangeController {

  constructor() {
    /** @type {import('../../../Services/CurrencyService')} */
    this.currencyService = new CurrencyService();
  }

  /**
  * @swagger
  * "/api/currencies":
  *   get:
  *     tags:
  *       - Currency Exchange
  *     summary: List all Currencies
  *     parameters:
  *       - name: exclude
  *         description: ID of Currency Excluded
  *         in: query
  *         required: false
  *         type: integer
  *     responses:
  *       200:
  *         description: Show the list of currencies
  *         example:
  *           message: Success
  */
  getAllCurrencies ({auth, request, response}) {
    const exclude = request.input('exclude', null);
    return this.currencyService.getAllCurrenciesButExcludeOne(
      exclude? parseInt(exclude) : null
    );
  }

 /**
  * @swagger
  * "/api/currency/:id":
  *   get:
  *     tags:
  *       - Currency Exchange
  *     summary: Find a currency by its ID
  *     responses:
  *       200:
  *         description: Currency Found
  *         example:
  *           message: Success
  *       404:
  *         description: Currency Not Found
  *         example:
  *           message: Not Found
  */
  async findCurrencyById ({auth, request, params, response}) {
    const currency = await this.currencyService.findCurrencyById(params.id);
    if (!currency) {
      throw new CustomHttpException('Currency Not Found!', 404, { id: params.id });
    }
    return currency;
  }

  /**
  * @swagger
  * "/api/exchange/default-currencies/:order?":
  *   get:
  *     tags:
  *       - Get Default Currencies to Exchange
  *     summary: Get Default Currencies to Exchange
  *     responses:
  *       200:
  *         description: Default Currencies to Exchange
  *         example:
  *           message: Success
  *       404:
  *         description: Currencies Not Found
  *         example:
  *           message: Not Found
  */
  getDefaultExchageCurrencies ({auth, request, params, response}) {
    const order = params.order || 'asc';
    return this.currencyService.getDefaultExchageCurrencies(order);
  }

 /**
  * @swagger
  * "/api/exchange/:currencyFrom/:currencyTo/calculate":
  *   get:
  *     tags:
  *       - Currency Exchange
  *     summary: Calculate a currency exchange
  *     parameters:
  *       - name: value
  *         description: Value of the from currency
  *         in: query
  *         required: true
  *         type: float
  *     responses:
  *       200:
  *         description: Exchange Calculated
  *         example:
  *           message: Success
  *       404:
  *         description: Currency Not Found
  *         example:
  *           message: Not Found
  */
  async exchageCalculate ({auth, request, params, response}) {
    let currencyFromId = params.currencyFrom;
    if (currencyFromId) {
      currencyFromId = parseInt(currencyFromId);
    }
    let currencyToId = params.currencyTo;
    if (currencyToId) {
      currencyToId = parseInt(currencyToId);
    }
    let value = request.input('value', null);
    if (!value) {
      throw new CustomHttpException('The value to be exchanged is required!', 409);
    }
    else {
      value = parseFloat(value);
    }
    return await this.currencyService.exchangeCalculate(currencyFromId, currencyToId, value);
  }

}

module.exports = ExchangeController
