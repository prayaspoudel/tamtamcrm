<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmailTemplatesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {


        DB::table('email_templates')->delete();

        DB::table('email_templates')->insert(array(
            0  =>
                array(
                    'id'                => 1,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'custom1',
                    'subject'           => trans('texts.custom1_subject'),
                    'message'           => trans('texts.custom1_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            1  =>
                array(
                    'id'                => 2,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'custom2',
                    'subject'           => trans('texts.custom2_subject'),
                    'message'           => trans('texts.custom2_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            2  =>
                array(
                    'id'                => 3,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'custom3',
                    'subject'           => trans('texts.custom3_subject'),
                    'message'           => trans('texts.custom3_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            3  =>
                array(
                    'id'                => 4,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'statement',
                    'subject'           => trans('texts.statement_subject'),
                    'message'           => trans('texts.statement_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            4  =>
                array(
                    'id'                => 5,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'invoice',
                    'subject'           => trans('texts.invoice_subject'),
                    'message'           => trans('texts.invoice_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            5  =>
                array(
                    'id'                => 6,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'quote',
                    'subject'           => trans('texts.quote_subject'),
                    'message'           => trans('texts.quote_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            6  =>
                array(
                    'id'                => 7,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'credit',
                    'subject'           => trans('texts.credit_subject'),
                    'message'           => trans('texts.credit_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            7  =>
                array(
                    'id'                => 8,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'payment',
                    'subject'           => trans('texts.payment_subject'),
                    'message'           => trans('texts.payment_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            8  =>
                array(
                    'id'                => 9,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'lead',
                    'subject'           => trans('texts.lead_subject'),
                    'message'           => trans('texts.lead_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            9  =>
                array(
                    'id'                => 10,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'order',
                    'subject'           => trans('order_received_subject'),
                    'message'           => trans('order_received_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            10 =>
                array(
                    'id'                => 11,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'payment_partial',
                    'subject'           => trans('texts.partial_payment_subject'),
                    'message'           => trans('texts.partial_payment_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            11 =>
                array(
                    'id'                => 12,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'order_received',
                    'subject'           => trans('texts.order_received_subject'),
                    'message'           => trans('texts.order_received_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            12 =>
                array(
                    'id'                => 13,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'order_sent',
                    'subject'           => trans('texts.order_sent_subject'),
                    'message'           => trans('texts.order_sent_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            13 =>
                array(
                    'id'                => 14,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'case',
                    'subject'           => trans('texts.case_subject'),
                    'message'           => trans('texts.case_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            14 =>
                array(
                    'id'                => 15,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'task',
                    'subject'           => trans('texts.task_subject'),
                    'message'           => trans('texts.task_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            15 =>
                array(
                    'id'                => 16,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'deal',
                    'subject'           => trans('texts.deal_subject'),
                    'message'           => trans('texts.deal_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            16 =>
                array(
                    'id'                => 17,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'purchase_order',
                    'subject'           => trans('texts.purchase_order_subject'),
                    'message'           => trans('texts.purchase_order_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            17 =>
                array(
                    'id'                => 18,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'endless',
                    'subject'           => trans('texts.endless_subject'),
                    'message'           => trans('texts.endless_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            18 =>
                array(
                    'id'                => 19,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'purchase_order_approved',
                    'subject'           => trans('texts.purchase_order_approved_subject'),
                    'message'           => trans('texts.purchase_order_approved_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            19 =>
                array(
                    'id'                => 20,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'quote_approved',
                    'subject'           => trans('texts.quote_approved_subject'),
                    'message'           => trans('texts.quote_approved_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            20 =>
                array(
                    'id'                => 21,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'purchase_order_rejected',
                    'subject'           => trans('texts.purchase_order_rejected_subject'),
                    'message'           => trans('texts.purchase_order_rejected_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            21 =>
                array(
                    'id'                => 22,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'quote_rejected',
                    'subject'           => trans('texts.quote_rejected_subject'),
                    'message'           => trans('texts.quote_rejected_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            22 =>
                array(
                    'id'                => 23,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'quote_change_requested',
                    'subject'           => trans('texts.quote_change_requested_subject'),
                    'message'           => trans('texts.quote_change_requested_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
            23 =>
                array(
                    'id'                => 24,
                    'account_id'        => 1,
                    'user_id'           => 5,
                    'template'          => 'purchase_order_change_requested',
                    'subject'           => trans('texts.purchase_order_change_requested_subject'),
                    'message'           => trans('texts.purchase_order_change_requested_body'),
                    'amount_to_charge'  => '0.00',
                    'frequency_id'      => 0,
                    'percent_to_charge' => '0.00',
                    'enabled'           => 1,
                    'created_at'        => '2021-05-26 14:06:02',
                    'updated_at'        => '2021-05-26 14:52:58',
                ),
        ));
    }
}