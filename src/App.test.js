import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

describe('App for Snapshot testing', () => {
  test('Snapshot testing', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('App using RTL', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders App', () => {
    const link = screen.getAllByRole('link');
    expect(link).toHaveLength(9);
  });

  test('renders correct link for Products Inventory', () => {
    const linkProdInv = screen.getAllByRole('link');
    expect(linkProdInv[0]).toHaveTextContent('Products Inventory');
  });

  test('renders correct link for About', () => {
    const linkAbout = screen.getAllByRole('link');
    expect(linkAbout[1]).toHaveTextContent('About');
  });

  test('renders correct link for Viewing the Products', () => {
    const linkViewProd = screen.getAllByRole('link');
    expect(linkViewProd[2]).toHaveTextContent('Login');
  });

  test('renders three options for categorizing including All', () => {
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  test('renders default option for categorizing', () => {
    const optElec = screen.getAllByRole('option');
    expect(optElec[0]).toHaveTextContent('All');
  });

  test('renders correct option for Electronics category', () => {
    const optElec = screen.getAllByRole('option');
    expect(optElec[1]).toHaveTextContent('Electronics');
  });

  test('renders correct option for Fashion category', () => {
    const optFash = screen.getAllByRole('option');
    expect(optFash[3]).toHaveTextContent('Fashion');
  });
});
