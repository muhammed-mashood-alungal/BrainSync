import { GroupServices } from "@/services/client/group.client";
import GroupList from "./GroupList";
import { IGroupType } from "@/types/groupTypes";
import { getAllGroupsServer } from "@/services/server/group.server";


const GroupsPage: React.FC =async () => {

  const fetchGroups = async () => {
    try {
      return await getAllGroupsServer();
    } catch (err) {
      return [];
    }
  };
  
  const groups = await fetchGroups();
 
    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white p-6 ml-1">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">All Groups</h1>
            </div>

          <GroupList inititalGroups={groups as IGroupType[]}/>
        </div>
    );
};

export default GroupsPage;