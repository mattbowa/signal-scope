// Type definitions for sensor data structure

interface DataPoint {
  ts: string;
  value: number;
  q: 'good' | 'uncertain' | 'bad';
}

export interface Tag {
  id: string;
  label: string;
  unit: string;
  points: DataPoint[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  tags: Tag[];
}

export interface Site {
  id: string;
  name: string;
  assets: Asset[];
}

export interface SensorData {
  sites: Site[];
}

// Helper type for flattened tag with site/asset info
export interface TagWithContext extends Tag {
  siteName: string;
  assetName: string;
  fullPath: string; // e.g., "West Weir > Pump A > Flow"
}
