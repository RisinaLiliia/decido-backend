// src/modules/companies/companies.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompaniesService } from './companies.service';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { CompanyCategory } from './dto/create-company.dto';
/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

describe('CompaniesService', () => {
  let service: CompaniesService;
  let model: jest.Mocked<Model<any>>;

  const mockCompany = {
    _id: 'companyId',
    name: 'Test Cafe',
    category: CompanyCategory.CAFE,
    city: 'Berlin',
    rating: 4.5,
    votes: 10,
    offers: [],
    geo: {
      type: 'Point',
      coordinates: [13.4, 52.5],
    },
    workingHours: [{ day: 'Monday', open: '08:00', close: '22:00' }],
    isActive: true,
  };

  const mockCompanyModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getModelToken(Company.name),
          useValue: mockCompanyModel,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    model = module.get(getModelToken(Company.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a company', async () => {
    model.create.mockResolvedValue(mockCompany as any);

    const result = await service.create({
      name: 'Test Cafe',
      category: CompanyCategory.CAFE,
      address: 'Street 1',
      city: 'Berlin',
      geo: { type: 'Point', coordinates: [13.4, 52.5] },
      ownerId: 'userId',
    });

    expect(model.create).toHaveBeenCalled();
    expect(result.name).toBe('Test Cafe');
  });

  it('should add offer to company', async () => {
    model.findByIdAndUpdate.mockResolvedValue({
      ...mockCompany,
      offers: [
        {
          title: 'Discount',
          description: '10% off',
          validUntil: new Date(Date.now() + 100000),
        },
      ],
    } as any);

    const result = await service.addOffer('companyId', {
      title: 'Discount',
      description: '10% off',
      validUntil: new Date(Date.now() + 100000),
    });

    expect(model.findByIdAndUpdate).toHaveBeenCalled();
    expect(result?.offers.length).toBe(1);
  });

  it('should return filtered companies', async () => {
    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCompany as any]),
    } as any);

    const result = await service.findAll({
      category: CompanyCategory.CAFE,
      city: 'Berlin',
      minRating: 4,
    });

    expect(result.length).toBe(1);
    expect(result[0].category).toBe('cafe');
  });

  it('should perform geo search', async () => {
    model.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCompany as any]),
    } as any);

    const result = await service.findAll({
      nearLat: 52.5,
      nearLng: 13.4,
      distance: 5,
    });

    expect(model.find).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should return best company for decideNow', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([mockCompany as any]);

    const result = await service.decideNow({
      category: CompanyCategory.CAFE,
      city: 'Berlin',
      userLat: 52.5,
      userLng: 13.4,
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('Test Cafe');
  });
});
