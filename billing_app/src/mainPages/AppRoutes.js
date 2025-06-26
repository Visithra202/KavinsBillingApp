import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './features/Dashboard'
import AddItem from './features/stocks/AddItem'
import Categories from './features/master_data/Categories'
import Brands from './features/master_data/Brands'
import StockList from './features/stocks/StockList'
import EditItem from './features/stocks/EditItem'
import CustomerData from './features/customers/CustomerData'
import AddSale from './features/sales/AddSale'
import SaleList from './features/sales/SaleList'
import CreateLoan from './features/loan/CreateLoan'
import LoanList from './features/loan/LoanList'
import AddPurchase from './features/purchase/AddPurchase'
import PurchaseList from './features/purchase/PurchaseList'
import SellerData from './features/sellers/SellerData'
import Users from './features/master_data/Users'
import SaleDetails from './features/sales/SaleDetails'
import LoanDetails from './features/loan/LoanDetails'
import PrintSale from './features/sales/PrintSale'
import LoanCollection from './features/loan/LoanCollection'
import LoanBill from './features/loan/LoanBill'
import AddLoanPayment from './features/loan/AddLoanPayment'
import PurchaseDetails from './features/purchase/PurchaseDetails'
import Reports from './features/reports/Reports'
import SaleByCustomer from './features/reports/sale_report/SaleByCustomer'
import SaleByProducts from './features/reports/sale_report/SaleByProducts'
import PurchaseByProducts from './features/reports/purchase_report/PurchaseByProducts'
import PurchaseBySeller from './features/reports/purchase_report/PurchaseBySeller'
import Invest from './features/master_data/Invest'
import ReceiveIncome from './features/master_data/ReceiveIncome'
import StockRequired from './features/reports/stock_report/StockRequired'
import PayAdvanced from './features/loan/PayAdvanced'
import TransferAmount from './features/master_data/TransferAmount'
import ServiceEntry from './features/service/ServiceEntry'
import ServiceList from './features/service/ServiceList'
import ServiceDetails from './features/service/ServiceDetails'
import BalanceSheetReport from './features/reports/balancesheet_report/BalanceSheetReport'
import CashReport from './features/reports/gl_report/CashReport'
import AccountReport from './features/reports/gl_report/AccountReport'
import PenaltyReport from './features/reports/gl_report/PenaltyReport'
import MobileReport from './features/reports/gl_report/MobileReport'
import AccessoriesReport from './features/reports/gl_report/AccessoriesReport'
import ServiceReport from './features/reports/gl_report/ServiceReport'

export default function AppRoutes() {
  return (
    <div>
      <Routes>


        {/* dashboard  */}
        <Route path='/dashboard' element={<Dashboard />}></Route>

        {/* Reports */}
        <Route path='/reports' element={<Reports />}></Route>


        {/* sale */}
        <Route path='/addSale' element={<AddSale />}></Route>
        <Route path='/saleList' element={<SaleList />}></Route>
        <Route path='/saleDetails' element={<SaleDetails />}></Route>
        <Route path='/printSale' element={<PrintSale />}></Route>


        {/* purchase */}
        <Route path='/addPurchase' element={<AddPurchase />}></Route>
        <Route path='/purchaseList' element={<PurchaseList />}></Route>
        <Route path='/purchaseDetails' element={<PurchaseDetails />}></Route>


        {/* Item */}
        <Route path='/addItem' element={<AddItem />}></Route>
        <Route path='/editItem' element={<EditItem />}></Route>
        <Route path='/stockList' element={<StockList />}></Route>

        {/* master data */}
        <Route path='/categories' element={<Categories />}></Route>
        <Route path='/brands' element={<Brands />}></Route>
        <Route path='/users' element={<Users />}></Route>
        <Route path='/invest' element={<Invest />}></Route>
        <Route path='/receiveIncome' element={<ReceiveIncome />}></Route>
        <Route path='/transferAmount' element={<TransferAmount />}></Route>

        {/* service */}
        <Route path='/serviceEntry' element={<ServiceEntry />}></Route>
        <Route path='/serviceList' element={<ServiceList />}></Route>
        <Route path='/serviceDetails' element={<ServiceDetails />}></Route>


        {/*customer */}
        <Route path='/customerData' element={<CustomerData />}></Route>

        {/* seller */}
        <Route path='/sellerData' element={<SellerData />}></Route>


        {/* loan */}
        <Route path='/createLoan' element={<CreateLoan />}></Route>
        <Route path='/loanList' element={<LoanList />}></Route>
        <Route path='/loanDetails' element={<LoanDetails />}></Route>
        <Route path='/loanCollection' element={<LoanCollection />}></Route>
        <Route path='/addLoanPayment' element={<AddLoanPayment />}></Route>
        <Route path='/loanBills' element={<LoanBill />}></Route>
        <Route path='/payAdvanced' element={<PayAdvanced />}></Route>

        {/* Reports */}
        <Route path='/reports/sale/sale_by_customer' element={<SaleByCustomer />} />
        <Route path='/reports/sale/sale_by_products' element={<SaleByProducts />} />
        <Route path='/reports/purchase/purchase_by_products' element={<PurchaseByProducts />}></Route>
        <Route path='/reports/purchase/purchase_by_seller' element={<PurchaseBySeller />}></Route>
        <Route path='/reports/cash_report' element={<CashReport />} />
        <Route path='/reports/account_report' element={<AccountReport />} />
        <Route path='/reports/balancesheet_report' element={<BalanceSheetReport />} />
        <Route path='/reports/stock/required_stock' element={<StockRequired />} />
        <Route path='/reports/penalty_report' element={<PenaltyReport />} />
        <Route path='/reports/mobile_report' element={<MobileReport />} />
        <Route path='/reports/accessories_report' element={<AccessoriesReport />} />
        <Route path='/reports/service_report' element={<ServiceReport />} />

      </Routes>
    </div>
  )
}
