import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";

import getListings from "../actions/getListings";
import PropertiesClient from "./PropertiesClient";
import Footer from "../components/Footer";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subtitle="Please login"
        />
        <Footer />
      </ClientOnly>
    );
  }

  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No properties found"
          subtitle="Looks like you have no properties."
        />
        <Footer />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <PropertiesClient listings={listings} currentUser={currentUser} />
      <Footer />
    </ClientOnly>
  );
}
 
export default PropertiesPage;