import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserGroup, 
  faWindowRestore, 
  faListCheck, 
  faCode, 
  faDesktop, 
  faUserLock ,
} from '@fortawesome/free-solid-svg-icons';


const FeatureCard = (props : {icon : any , title :string , description : string}) => {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <div className="bg-gray-900 rounded-full p-12 mb-6">
        <FontAwesomeIcon 
          icon={props.icon} 
          className="text-cyan-400 text-5xl w-10" 
        />
      </div>
      <h3 className="text-xl font-bold mb-3">{props.title}</h3>
      <p className="text-gray-400 max-w-xs">{props.description}</p>
    </div>
  );
};

const FeaturesShowcase = () => {
  const features = [
    {
      icon: faUserGroup,
      title: "Collaborative Sessions",
      description: "Create and join study sessions with peers in real-time"
    },
    {
      icon: faWindowRestore,
      title: "Shared Resources",
      description: "Access whiteboards, PDF notes, and code editors all in one place"
    },
    {
      icon: faListCheck,
      title: "Track Progress",
      description: "Monitor your study sessions and academic improve"
    },
    {
      icon: faCode,
      title: "Code Together",
      description: "Collaborate on coding problems with real-time editing"
    },
    {
      icon: faDesktop,
      title: "Cross-Platform",
      description: "Access from any device, anywhere, anytime"
    },
    {
      icon: faUserLock,
      title: "Track Progress",
      description: "Monitor your study sessions and academic improve"
    }
  ];

  return (
    <section className="py-16 px-4 bg-customGrey">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose Brain Sync?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;