import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create Context
const DashboardContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_COMPONENT_DATA: 'SET_COMPONENT_DATA',
  UPDATE_HEADER: 'UPDATE_HEADER',
  UPDATE_NAVBAR: 'UPDATE_NAVBAR',
  UPDATE_FOOTER: 'UPDATE_FOOTER',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  loading: true,
  error: null,
  currentPage: 'home',
  componentData: {
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
      phone: '123-456-7890',
      address: '123 Main St, Jaffna, Sri Lanka'
    }
  }
};

// Reducer function
function dashboardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_COMPONENT_DATA:
      return { ...state, componentData: action.payload };
    
    case ACTIONS.UPDATE_HEADER:
      return {
        ...state,
        componentData: {
          ...state.componentData,
          header: { ...state.componentData.header, ...action.payload }
        }
      };
    
    case ACTIONS.UPDATE_NAVBAR:
      return {
        ...state,
        componentData: {
          ...state.componentData,
          navbar: { ...state.componentData.navbar, ...action.payload }
        }
      };
    
    case ACTIONS.UPDATE_FOOTER:
      return {
        ...state,
        componentData: {
          ...state.componentData,
          footer: { ...state.componentData.footer, ...action.payload }
        }
      };
    
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

// Context Provider Component
export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Load initial data
  const loadInitialData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
      
      const response = await axios.get(`${API_BASE_URL}/components`);
      dispatch({ type: ACTIONS.SET_COMPONENT_DATA, payload: response.data });
    } catch (error) {
      console.error('Error loading data from backend:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load data from server' });
      
      // Fall back to localStorage if backend fails
      const savedData = localStorage.getItem('dashboardData');
      if (savedData) {
        dispatch({ type: ACTIONS.SET_COMPONENT_DATA, payload: JSON.parse(savedData) });
      }
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Save data to backend
  const saveData = async (data) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
      
      await axios.post(`${API_BASE_URL}/components`, data);
      
      // Save to localStorage as backup
      localStorage.setItem('dashboardData', JSON.stringify(data));
      
      dispatch({ type: ACTIONS.SET_COMPONENT_DATA, payload: data });
      return { success: true };
    } catch (error) {
      console.error('Error saving data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to save data' });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Navigation handler
  const navigateTo = (page) => {
    dispatch({ type: ACTIONS.SET_CURRENT_PAGE, payload: page });
  };

  // Update individual components
  const updateHeader = (headerData) => {
    dispatch({ type: ACTIONS.UPDATE_HEADER, payload: headerData });
  };

  const updateNavbar = (navbarData) => {
    dispatch({ type: ACTIONS.UPDATE_NAVBAR, payload: navbarData });
  };

  const updateFooter = (footerData) => {
    dispatch({ type: ACTIONS.UPDATE_FOOTER, payload: footerData });
  };

  // Update entire component data
  const updateComponentData = (newData) => {
    dispatch({ type: ACTIONS.SET_COMPONENT_DATA, payload: newData });
  };

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const contextValue = {
    // State
    ...state,
    
    // Actions
    loadInitialData,
    saveData,
    navigateTo,
    updateHeader,
    updateNavbar,
    updateFooter,
    updateComponentData
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook to use the Dashboard Context
export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}

export default DashboardContext;
