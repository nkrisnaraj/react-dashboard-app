const ComponentsModel = require('../models/componentsModel');

class ComponentsController {
  async getComponents(req, res) {
    try {
      const data = await ComponentsModel.getComponentData();
      res.json(data);
    } catch (error) {
      console.error('Error in getComponents:', error);
      res.status(500).json({ 
        error: 'Failed to fetch component data',
        message: error.message 
      });
    }
  }

  async saveComponents(req, res) {
    try {
      const { header, navbar, footer } = req.body;
      
      // Validate the input data
      const validation = ComponentsModel.validateComponentData({ header, navbar, footer });
      if (!validation.valid) {
        return res.status(400).json({ 
          error: validation.error 
        });
      }

      // Save the data
      const result = await ComponentsModel.saveComponentData({ header, navbar, footer });
      res.json(result);
    } catch (error) {
      console.error('Error in saveComponents:', error);
      res.status(500).json({ 
        error: 'Failed to save component data',
        message: error.message 
      });
    }
  }

  async healthCheck(req, res) {
    try {
      // Check if database is connected
      const database = require('../config/db');
      const db = database.getDb();
      
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: db ? 'Connected' : 'Disconnected',
        service: 'Dashboard API',
        version: '1.0.0'
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'Error', 
        timestamp: new Date().toISOString(),
        database: 'Disconnected',
        error: error.message
      });
    }
  }
}

module.exports = new ComponentsController();
