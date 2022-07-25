/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // eslint-disable-next-line no-undef
  this.width = width;
  // eslint-disable-next-line no-undef
  this.height = height;
  // eslint-disable-next-line no-undef
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  calls: [],

  element(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = this.result + value;
    cssObj.ID = 1;
    this.checkUniq(cssObj.ID);
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  id(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = `${this.result}#${value}`;
    cssObj.ID = 2;
    this.checkUniq(cssObj.ID);
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  class(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = `${this.result}.${value}`;
    cssObj.ID = 3;
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  attr(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = `${this.result}[${value}]`;
    cssObj.ID = 4;
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  pseudoClass(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = `${this.result}:${value}`;
    cssObj.ID = 5;
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  pseudoElement(value) {
    const cssObj = Object.create(cssSelectorBuilder);
    cssObj.result = `${this.result}::${value}`;
    cssObj.ID = 6;
    this.checkUniq(cssObj.ID);
    cssObj.calls = [...this.calls, cssObj.ID];
    this.checkOrder(cssObj.ID);
    return cssObj;
  },

  combine(selector1, combinator, selector2) {
    const cssObj = Object.create(cssSelectorBuilder);
    const sel1 = selector1.result;
    const sel2 = selector2.result;
    cssObj.result = `${this.result}${sel1} ${combinator} ${sel2}`;
    cssObj.calls = [...this.calls, sel1.calls, sel2.calls];
    return cssObj;
  },

  stringify() {
    return this.result;
  },

  checkUniq(ID) {
    if (this.calls.includes(ID)) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  checkOrder(x) {
    if (this.ID > x) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
