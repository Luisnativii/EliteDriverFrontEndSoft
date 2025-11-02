import MainHomeSection from '../../components/customer/MainHomeSection' ;
import MainInfoSection from '../../components/customer/MainInfoSection' ;
import MainCarsSelectionSection from '../../components/customer/MainCarsSelectionSection';


const HomePage = () => {
    return(
        <div>
            <MainHomeSection/>
            <MainInfoSection/>
            <MainCarsSelectionSection/>
        </div>
    );
}

export default HomePage;