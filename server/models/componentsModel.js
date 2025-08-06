const database = require('../config/db');

class ComponentsModel {
  constructor() {
    this.collectionName = 'components';
  }

  getCollection() {
    const db = database.getDb();
    return db.collection(this.collectionName);
  }

  getDefaultData() {
    return {
      type: 'dashboard_content',
      header: {
        title: 'Welcome to My Website',
        imageUrl: ''
      },
      navbar: {
        links: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Contact', url: '/contact' }
        ]
      },
      footer: {
        email: 'info@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      }
    };
  }

  async getComponentData() {
    try {
      const collection = this.getCollection();
      const data = await collection.findOne({ type: 'dashboard_content' });
      
      if (!data) {
        // Insert and return default data if none exists
        const defaultData = this.getDefaultData();
        await collection.insertOne(defaultData);
        return defaultData;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching component data:', error);
      throw error;
    }
  }

  async saveComponentData(componentData) {
    try {
      const collection = this.getCollection();
      
      const dataToSave = {
        type: 'dashboard_content',
        ...componentData,
        updatedAt: new Date()
      };
      
      const result = await collection.replaceOne(
        { type: 'dashboard_content' },
        dataToSave,
        { upsert: true }
      );
      
      return {
        success: true,
        message: 'Component data saved successfully',
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount
      };
    } catch (error) {
      console.error('Error saving component data:', error);
      throw error;
    }
  }

  validateComponentData(data) {
    const { header, navbar, footer } = data;
    
    if (!header || !navbar || !footer) {
      return {
        valid: false,
        error: 'Missing required component data (header, navbar, or footer)'
      };
    }

    // Additional validation can be added here
    if (!header.title || typeof header.title !== 'string') {
      return {
        valid: false,
        error: 'Header title is required and must be a string'
      };
    }

    if (!Array.isArray(navbar.links) || navbar.links.length !== 3) {
      return {
        valid: false,
        error: 'Navbar must contain exactly 3 links'
      };
    }

    if (!footer.email || !footer.phone || !footer.address) {
      return {
        valid: false,
        error: 'Footer must contain email, phone, and address'
      };
    }

    return { valid: true };
  }
}

module.exports = new ComponentsModel();
