import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import Widget from "components/widget/Widget";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck";
import tableDataComplex from "./variables/tableDataComplex";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
const testdaTA = [
  {
    status:"Ongoing",
    team:"FAIA",
    userCounts: 3
  },
  {
    status:"Upcoming",
    team:"AMAP",
    till:"15min",
    userCounts: 0
  },
  {
    status:"Upcoming",
    team:"FAIA",
    till:"10min",
    userCounts: 0
  },
  {
    status:"Upcoming",
    team:"FAIA",
    till:"5min",
    userCounts: 0
  }

]
const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
    
          {
            testdaTA.map((item,index)=>
              (
              <div onClick={()=>navigate(`/admin/room/${uuid()}`)}>
              <Widget
              key={index}
              icon={<MdVideoCall className="h-7 w-7" />}
              title={item.status}
              subtitle={item.team}
              tillData={item.status == "Upcoming" ? item.till :null}
              userCount={item.status == "Ongoing" ? item.userCounts : null} 
            />
            </div>
              )
            )
          }



       
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}
          
            
          
         
    


      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}


        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
