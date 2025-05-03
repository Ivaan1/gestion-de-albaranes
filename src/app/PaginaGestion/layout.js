
import Header from '../components/Header'
import Sidebar from '../components/Sidebar';


const DashboardLayout = ({ children }) => {
    return (

        
      <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-1">  {/* Aquí el espacio del sidebar */}

        <Header />
        <main className="p-20">
          {children}  {/* Este es el contenido principal */}
        </main>
      </div>
    </div>
        
      
    );
  };

export default DashboardLayout;
  