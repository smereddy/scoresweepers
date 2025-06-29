import { describe, it, expect } from 'vitest';
import { stripeProducts, getProductById, getProductByPriceId } from './stripe-config';

describe('stripe-config', () => {
  describe('stripeProducts', () => {
    it('contains valid product structure', () => {
      expect(Array.isArray(stripeProducts)).toBe(true);
      expect(stripeProducts.length).toBeGreaterThan(0);
      
      stripeProducts.forEach(product => {
        expect(product.id).toBeDefined();
        expect(product.priceId).toBeDefined();
        expect(product.name).toBeDefined();
        expect(product.description).toBeDefined();
        expect(product.mode).toBeDefined();
        expect(['payment', 'subscription']).toContain(product.mode);
      });
    });

    it('has donation product', () => {
      const donationProduct = stripeProducts.find(p => p.name === 'Donation');
      expect(donationProduct).toBeDefined();
      expect(donationProduct?.mode).toBe('payment');
    });
  });

  describe('getProductById', () => {
    it('returns product when found', () => {
      const firstProduct = stripeProducts[0];
      const result = getProductById(firstProduct.id);
      
      expect(result).toEqual(firstProduct);
    });

    it('returns undefined when not found', () => {
      const result = getProductById('non-existent-id');
      
      expect(result).toBeUndefined();
    });
  });

  describe('getProductByPriceId', () => {
    it('returns product when found', () => {
      const firstProduct = stripeProducts[0];
      const result = getProductByPriceId(firstProduct.priceId);
      
      expect(result).toEqual(firstProduct);
    });

    it('returns undefined when not found', () => {
      const result = getProductByPriceId('non-existent-price-id');
      
      expect(result).toBeUndefined();
    });
  });
});