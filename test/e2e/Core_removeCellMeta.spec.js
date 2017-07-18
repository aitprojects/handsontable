describe('Core_removeCellMeta', () => {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should remove meta for cell', () => {
    handsontable({
      data: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 9, 8, 7]
      ]
    });
    var border = {
      top: {

      },
      left: {

      }
    };

    setCellMeta(0, 0, 'borders', border);
    expect(getCellMeta(0, 0).borders).toEqual(border);

    removeCellMeta(0, 0, 'borders');
    expect(getCellMeta(0, 0).borders).toBeUndefined();
  });

  it('should remove proper cell meta when indexes was modified', () => {
    handsontable({
      modifyRow(row) {
        return row + 10;
      },
      modifyCol(col) {
        return col + 10;
      }
    });

    setCellMeta(0, 0, 'key', 'value');
    removeCellMeta(0, 0, 'key');

    expect(getCellMeta(0, 0).key).toBeUndefined();
  });

  it('should trigger `beforeRemoveCellMeta` hook with proper parameters #4410', function () {
    const beforeRemoveCellMeta = jasmine.createSpy('beforeRemoveCellMeta');

    handsontable({
      data: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 9, 8, 7]
      ],
      beforeRemoveCellMeta
    });

    setCellMeta(0, 0, 'key', 'value');
    removeCellMeta(0, 0, 'key');

    expect(beforeRemoveCellMeta).toHaveBeenCalledWith(0, 0, 'key', 'value', undefined, undefined);
  });

  it('should trigger `afterRemoveCellMeta` hook with proper parameters - case 1 (removed `key` existed) #4410', function () {
    const afterRemoveCellMeta = jasmine.createSpy('afterRemoveCellMeta');

    handsontable({
      data: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 9, 8, 7]
      ],
      afterRemoveCellMeta
    });

    setCellMeta(0, 0, 'key', 'value');
    removeCellMeta(0, 0, 'key');

    expect(afterRemoveCellMeta).toHaveBeenCalledWith(0, 0, 'key', true, undefined, undefined);
  });

  it('should trigger `afterRemoveCellMeta` hook with proper parameters - case 2  (removed `key` not existed) #4410', function () {
    const afterRemoveCellMeta = jasmine.createSpy('afterRemoveCellMeta');

    handsontable({
      data: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [0, 9, 8, 7]
      ],
      afterRemoveCellMeta
    });

    removeCellMeta(0, 0, 'key');
    expect(afterRemoveCellMeta).toHaveBeenCalledWith(0, 0, 'key', false, undefined, undefined);
  });

  it('should call `beforeRemoveCellMeta` plugin hook with visual indexes as parameters', () => {
    let rowInsideHook;
    let colInsideHook;

    handsontable({
      beforeRemoveCellMeta: function (row, col) {
        rowInsideHook = row;
        colInsideHook = col;
      },
      modifyRow(row) {
        return row + 10;
      },
      modifyCol(col) {
        return col + 10;
      }
    });

    removeCellMeta(0, 1, 'key');
    expect(rowInsideHook).toEqual(0);
    expect(colInsideHook).toEqual(1);
  });

  it('should call `afterRemoveCellMeta` plugin hook with visual indexes as parameters', () => {
    let rowInsideHook;
    let colInsideHook;

    handsontable({
      afterRemoveCellMeta: function (row, col) {
        rowInsideHook = row;
        colInsideHook = col;
      },
      modifyRow(row) {
        return row + 10;
      },
      modifyCol(col) {
        return col + 10;
      }
    });

    removeCellMeta(0, 1, 'key');
    expect(rowInsideHook).toEqual(0);
    expect(colInsideHook).toEqual(1);
  });
});
