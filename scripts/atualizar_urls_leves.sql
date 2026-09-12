-- ==============================================================================
-- SCRIPT DE OTIMIZAÇÃO: SUBSTITUIÇÃO DE BASE64 POR URLS LEVES NO BANCO
-- Execute no SQL Editor do Supabase para reduzir o banco de 25MB para 25KB!
-- ==============================================================================

-- 1. Categorias
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/maquiagem_04a2999b.png' WHERE id = '04a2999b-1511-4164-9ad9-3811f0bbfdb6';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/estetica_geral_6f5d80b0.png' WHERE id = '6f5d80b0-1ae7-4748-9f00-1ff797dafab5';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/cabelo_c2397a1a.png' WHERE id = 'c2397a1a-2b1f-4821-820c-ad6870981818';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/combos_maquiagem_cabelo_f4f336c5.png' WHERE id = 'f4f336c5-20d0-4fe9-9fa5-c3a92174a2cf';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/sobrancelha_f855d46f.png' WHERE id = 'f855d46f-109d-4f1d-bff4-adde6ed7b87b';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/dia_da_noiva_918c0452.png' WHERE id = '918c0452-af7e-486c-bd4f-40c4e4b377d6';
UPDATE catalogo_categorias SET imagem_url = '/images/catalogo/categorias/dia_da_debutante_cc671588.png' WHERE id = 'cc671588-110a-4c23-ae07-1e16b7a01fa7';

-- 2. Servicos
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/design_de_sobrancelha_e58f331e.png' WHERE id = 'e58f331e-df32-40aa-a53d-8c4b318ea34c';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/epilacao_buco_com_cera_58bac31f.png' WHERE id = '58bac31f-e19c-4b72-a63c-18278977075a';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/maquiagem_social_glam_ac3e6df5.png' WHERE id = 'ac3e6df5-4235-4e87-92b5-260ffa1d9892';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/epilacao_buco_com_linha_46094541.png' WHERE id = '46094541-b50f-4615-b44f-790e78e947f5';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/maquiagem_infantil_f4b97dd7.png' WHERE id = 'f4b97dd7-544d-4dfe-9849-b61b2f9845d1';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/brow_lamination_design_5541f770.png' WHERE id = '5541f770-56dd-4f95-82d3-3a133430d524';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/combo_social_maquiagem_social_penteado_e3f5666c.png' WHERE id = 'e3f5666c-d6b1-4245-a042-fb87b63b5997';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/design_personalizado_coloracao_e103dd06.png' WHERE id = 'e103dd06-d182-4e0d-a958-b7cb79bb83b3';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/design_personalizado_henna_925babd9.png' WHERE id = '925babd9-307e-443e-b6e9-08c6a334de61';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/combo_infantil_0ed6d192.png' WHERE id = '0ed6d192-163a-4fcf-8c0a-4a25ce6a01de';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/experiencia_prata_1ac83893.png' WHERE id = '1ac83893-2045-4b04-b6ff-cb18f53eb82f';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/modelagem_cabelo_55c8e2b4.png' WHERE id = '55c8e2b4-8973-424f-a730-47fa1f48511f';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/penteado_cabelo_735647d4.png' WHERE id = '735647d4-77de-484d-906d-957f0b78dc16';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/experiencia_ouro_cbb6e206.png' WHERE id = 'cbb6e206-71e3-4c9d-96ff-a413ad0ac6be';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/experiencia_diamante_d7052c13.png' WHERE id = 'd7052c13-40c6-4736-8613-17cfc8ab47d3';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/dia_da_debutante_fa106cb6.png' WHERE id = 'fa106cb6-da0e-4b8d-b747-aef6808e9196';
UPDATE catalogo_servicos SET imagem_url = '/images/catalogo/servicos/combo_express_maquiagem_social_modelagem_6f8f55b8.png' WHERE id = '6f8f55b8-1563-48a3-a6fd-a0966fee68a4';
