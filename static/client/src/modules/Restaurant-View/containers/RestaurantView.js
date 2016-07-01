import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';
// import api from '../../utils/api';

import * as actions from '../ducks/RestaurantView.actions';
import RestaurantViewEntry from '../components/RestaurantView.entry';

let RestaurantView = React.createClass({
  propTypes: {
    actions: React.PropTypes.object,
    restaurant: React.PropTypes.object,
    recommendation: React.PropTypes.array,
  },

  componentDidMount() {
    console.log('[RestaurantView] componentDidMount');
    this.refreshComponent();
  },

  refreshComponent() {
    console.log('[RestaurantView] refreshComponent');
    const restaurant = this.retrieveRecommendations();
    this.retrieveRestaurant(restaurant);
  },

  retrieveRecommendations() {
    console.log('[RestaurantView] retrieveRecommendations');

    // mock recommendations array
    const mockRecommendations = [
      {
        cuisine: 'ethiopian',
        id: 'mock-1',
        name: 'Mock Restaurant 1',
        rating: 0.25202,
        userRated: false,
      },
      {
        cuisine: 'cafes',
        id: 'mock-2',
        name: 'Mock Restaurant 2',
        rating: 0.20202,
        userRated: false,
      },
      {
        cuisine: 'french',
        id: 'mock-3',
        name: 'Mock Restaurant 3',
        rating: 0.20202,
        userRated: false,
      },
    ];

    // retrieve restaurant recommendations from store
    const recommendations = this.props.recommendation || mockRecommendations;
    console.log('[RestaurantView] recommendations', recommendations);

    // return the next recommendation in the store
    return recommendations[0] || undefined;
  },

  retrieveRestaurant(recommendation) {
    console.log('[RestaurantView] retrieveRestaurant');

    // did we receive a restaurant?
    console.log('recommendation', recommendation);
    if (!recommendation) {
      return;
    }

    // // setup mock adapter
    // const mock = new MockAdapter(axios);

    // // mock for '/api/business/info?name=RESTAURANT.NAME'
    // mock.onGet(/\/api\/business\/info\?name\=.*/g).reply(function (config) {
    //   console.log('MOCK', config);

    //   return [
    //     200,
    //     {
    //       id: 1,
    //       business_id: 'tadu-ethiopian-kitchen-san-francisco-3',
    //       name: config.url.split('=')[1],
    //       address: '484 Ellis St',
    //       phone: '41577711111',
    //       city: 'San Francisco',
    //       state: 'CA',
    //       latitude: '37.7847934',
    //       longitude: '-122.4141884',
    //       rating: 5,
    //       review_count: 317,
    //       is_closed: '0',
    //       created_at: '2016-06-23T03:18:06.000Z',
    //       updated_at: '2016-06-23T03:18:06.000Z',
    //     },
    //   ];
    // });

    // retrieve restaurant data
    console.log('GET', 'http://localhost:3002/api/business/info?name=' + encodeURIComponent(recommendation.name));

    axios.get('http://localhost:3002/api/business/info?name=' + encodeURIComponent(recommendation.name))
      .then(function handleResponse(response) {
        console.log('[RestaurantView] /api/business/info', response.data);
        this.props.actions.restaurantUpdate(response.data);
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  },

  render() {
    let view;

    if (this.props.restaurant.latitude) {
      view = (
        <div className="RestaurantView">
          <RestaurantViewEntry {...this.props} refresh={this.refreshComponent} />
        </div>
      );
    } else {
      view = (
        <div className="RestaurantView">
          Waiting for restaurant...
        </div>
      );
    }

    return view;
  },
});

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant,
    recommendation: state.recommendation,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

RestaurantView = connect(mapStateToProps, mapDispatchToProps)(RestaurantView);

export default RestaurantView;
