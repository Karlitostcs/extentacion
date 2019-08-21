Begin Tran

-- INPUT TRANFER NUMBER AND LOCATION NUMBER

               

                declare @lid int,

                @ord int;

 

                set @lid = 'enter sending location id number';

                set @ord = 'enter sending order number';

 

 

-- UPDATES WHOLESALE QTY TO REVERSE FIRST TRANSFER COMPLETEION

 

               

                With Inc_Transfer (Part_Number, Qty)

                AS

                (SELECT IC_SKU_ID, QUANTITY_SHIPPED

                FROM dbo.SO_LINE_ITEM

                WHERE GM_LOCATION_ID = @lid and SO_ORDER_ID = @ord)    

               

                update IC_Inventory

                set Quantity_On_Hand = (Quantity_On_Hand + Inc_Transfer.Qty)

                from IC_INVENTORY, Inc_Transfer

                where (GM_Location_ID = @lid) and (IC_SKU_ID = Inc_Transfer.Part_Number)

 

-- UPDATES STATUS IN WHOLESALE

                             

                update SO_ORDER

                set SO_ORDER_STATUS_ID = 7

                where GM_LOCATION_ID = @lid and SO_ORDER_ID = @ord

 

-- THIS TRANSFER CAN NOW BE RECEIVED IN RE

Rollback Tran
