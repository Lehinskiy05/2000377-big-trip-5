import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDateToCustomFormat } from '../utils.js';
import { SHAKE_DELAY, FormType, UpdateType, UserAction } from '../const.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';

const createEventFormTemplate = (tripEvent, destinations, offersByType, formType) => {
  const { base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, offers, type } = tripEvent;

  const startTime = dateFrom ? formatDateToCustomFormat(dateFrom) : '';
  const endTime = dateTo ? formatDateToCustomFormat(dateTo) : '';
  const city = destinations.find((dest) => dest.id === destination)?.name;

  const destinationInfo = destination ? destinations.find((dest) => dest.id === destination) : { 'id': '', 'description': '', 'name': '', 'pictures': [] };
  const availableOffers = offersByType.find((offer) => offer.type === type).offers;

  const offerItems = availableOffers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer" ${offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');

  const destinationPhotos = destinationInfo.pictures.map((picture) => `
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
  `).join('');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/${type ? `icons/${type}.png` : 'logo.png'}" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city || ''}" placeholder="choose city" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}</datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" placeholder="start time">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" placeholder="end time">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="number" max="100000" name="event-price" value="${basePrice}" placeholder="price">
          </div>

          ${formType === FormType.CREATE ? `
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Cancel</button>
          ` : `
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          `}
        </header>
        <section class="event__details">
          ${offerItems ? `
            <section class="event__section event__section--offers">
              <h3 class="event__section-title event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offerItems}
              </div>
            </section>
          ` : ''}

          ${destinationInfo.description ? `
            <section class="event__section event__section--destination">
              <h3 class="event__section-title event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destinationInfo.description}</p>

              ${destinationPhotos ? `
                <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${destinationPhotos}
                </div>
              </div>
              ` : ''}
            </section>
          ` : ''}
        </section>
      </form>
    </li>
  `;
};

export default class CreateEditEventView extends AbstractStatefulView {
  #onCloseEditButtonClick = null;
  #onDataChange = null;
  #onEscKeyDownListener = null;
  #formType = null;
  #destinations = null;
  #offersByType = null;

  constructor(tripEvent, destinations, offers, onCloseEditButtonClick, onDataChange, onEscKeyDownListener, formType) {
    super();
    this._state = { ...tripEvent };
    this.#onCloseEditButtonClick = onCloseEditButtonClick;
    this.#onDataChange = onDataChange;
    this.#onEscKeyDownListener = onEscKeyDownListener;
    this.#formType = formType;

    this.#destinations = destinations;
    this.#offersByType = offers;

    this._restoreHandlers();
  }

  get template() {
    return createEventFormTemplate(this._state, this.#destinations, this.#offersByType, this.#formType);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveButtonClickHandler);

    if (this.#formType === FormType.EDIT) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditButtonClickHandler);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
    } else {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeEditButtonClickHandler);
    }

    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#eventTypeChangeHandler);
    });

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationChangeHandler);

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #setDisableFormElements(state) {
    this.element.querySelectorAll('input, select, button').forEach((element) => {
      element.disabled = state;
    });
  }

  #setSaving() {
    this.element.querySelector('.event__save-btn').textContent = 'Saving...';
    this.#setDisableFormElements(true);
  }

  #setDeleting() {
    this.element.querySelector('.event__reset-btn').textContent = 'Deleting...';
    this.#setDisableFormElements(true);
  }

  #setAborting() {
    this.#setDisableFormElements(false);
    const formElement = this.element.querySelector('.event--edit');
    formElement.classList.add('head-shake');
    setTimeout(() => {
      formElement.classList.remove('head-shake');
    }, SHAKE_DELAY);
    this.element.querySelector('.event__save-btn').textContent = 'Save';
    this.element.querySelector('.event__reset-btn').textContent = 'Delete';
  }

  getUpdatedPoint() {
    const formElement = this.element.querySelector('form');
    const formData = new FormData(formElement);

    const selectedType = formData.get('event-type');
    const selectedDestinationName = formData.get('event-destination');
    const selectedDestination = this.#destinations.find((dest) => dest.name === selectedDestinationName);
    const selectedOffers = Array.from(formElement.querySelectorAll('.event__offer-checkbox:checked'))
      .map((checkbox) => checkbox.id.replace('event-offer-', ''));

    const dateFrom = this._state.date_from ? new Date(this._state.date_from) : null;
    const dateTo = this._state.date_to ? new Date(this._state.date_to) : null;

    return {
      ...this._state,
      'type': selectedType,
      'destination': selectedDestination?.id || null,
      'base_price': Number(formData.get('event-price')),
      'date_from': dateFrom ? dateFrom.toISOString() : null,
      'date_to': dateTo ? dateTo.toISOString() : null,
      'offers': selectedOffers,
    };
  }

  #saveButtonClickHandler = async (evt) => {
    evt.preventDefault();
    const newPoint = this.getUpdatedPoint();
    this.#setSaving();

    try {
      await this.#onDataChange(
        this.#formType === FormType.CREATE ? UserAction.ADD_POINT : UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        { ...newPoint }
      );
      if (this.#formType === FormType.CREATE) {
        this.#onCloseEditButtonClick();
      }
      document.removeEventListener('keydown', this.#onEscKeyDownListener);
    } catch (error) {
      this.#setAborting();
    }
  };

  #deleteButtonClickHandler = async (evt) => {
    evt.preventDefault();
    this.#setDeleting();

    try {
      await this.#onDataChange(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        this._state
      );
      document.removeEventListener('keydown', this.#onEscKeyDownListener);
    } catch (error) {
      this.#setAborting();
    }
  };

  #closeEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseEditButtonClick();
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    this.updateElement({
      'type': targetType,
      'offers': [],
      'base_price': parseInt(this.element.querySelector('[name="event-price"]').value, 10) || 0
    });
  };

  #eventDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value.toLowerCase();
    const newDestination = this.#destinations.find((dest) => dest.name.toLowerCase() === targetDestination);
    this.updateElement({
      destination: newDestination ? newDestination.id : ''
    });
  };

  #getCurrentData = () => {
    const price = parseInt(this.element.querySelector('[name="event-price"]').value, 10) || 0;
    const offers = Array.from(
      this.element.querySelectorAll('[name="event-offer"]:checked')
    ).map((element) => element.id.replace('event-offer-', ''));
    return [price, offers];
  };

  #handleStartDateChange = ([selectedDate]) => {
    const endDate = new Date(this._state.date_to);

    const [price, selectedOfferIds] = this.#getCurrentData();

    const updatedState = {
      'date_from': selectedDate.toISOString(),
      ...(selectedDate > endDate && { 'date_to': selectedDate.toISOString() }),
      'base_price': price,
      'offers': selectedOfferIds,
    };

    this.updateElement(updatedState);
  };

  #handleEndDateChange = ([selectedDate]) => {
    const [price, selectedOfferIds] = this.#getCurrentData();

    this.updateElement({
      'date_to': selectedDate.toISOString(),
      'base_price': price,
      'offers': selectedOfferIds,
    });
  };

  #setDatepickerStart() {
    const startDateInput = this.element.querySelector('#event-start-time-1');
    flatpickr(startDateInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: this._state.date_from,
      onChange: this.#handleStartDateChange
    });
  }

  #setDatepickerEnd() {
    const endDateInput = this.element.querySelector('#event-end-time-1');
    flatpickr(endDateInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
      defaultDate: this._state.date_to,
      onChange: this.#handleEndDateChange,
      minDate: this._state.date_from
    });
  }
}
