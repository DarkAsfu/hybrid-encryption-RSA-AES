import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react"

const DashboardHeader = ({ root,rValue, sRValue, page }) => {
  return (
    <div>
      <Breadcrumbs size='lg' color='success'>
        <BreadcrumbItem href={`${root}`}>
          {rValue}
        </BreadcrumbItem>
        <BreadcrumbItem>
          {sRValue}
        </BreadcrumbItem>
      </Breadcrumbs>
      <h3 className='text-[2rem] text-[#484848] font-semibold'>
        {page}
      </h3>
    </div>
  )
}

export default DashboardHeader
