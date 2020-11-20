import CreateParentAccessoryButtonView from './create-parent-accessory-button-view';

export default class MoreParentAccessoryButtonView extends CreateParentAccessoryButtonView {
  public constructor() {
    super();

    this.getElement().style.backgroundImage =
      'url(https://www.gstatic.com/images/icons/material/system_gm/1x/more_vert_black_20dp.png)';
  }
}
