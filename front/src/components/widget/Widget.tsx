import Card from "components/card";

const Widget = (props: {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  tillData?:string,
  userCount?:number,
  onclick?:any,
}) => {
  const { icon, title, subtitle,tillData,userCount } = props;
  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px]"
    >
      <div 
      onClick={()=>onclick}
      className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        {
          tillData &&
          <p className="font-dm text-sm font-medium text-gray-600">in {tillData}</p>
        }
      
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {subtitle}
        </h4>
        {
            userCount &&
            <p className="font-dm text-sm font-medium text-gray-600">Users: {userCount}</p>
        }
       
      </div>
    </Card>
  );
};

export default Widget;
